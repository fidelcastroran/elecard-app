import React, { useState, useEffect } from "react";
import { Button, Collapse } from "react-bootstrap";
import { getDateFromTimestamp, getFileConversion } from "../../utils/utils";
import { fetchUrl } from "../../common/constants";
import ProgressBar from "../ProgressBar";
import { imageUrl } from "../../common/constants";

function Modal(props) {
  const { isOpen, onClose, imageSrc } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <img src={`${imageUrl}${imageSrc}`} alt="Modal" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function TreeNode({ node }) {
  const [open, setOpen] = useState(false);

  const styles = {
    padding: "15px",
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const handleThumbnailClick = (src) => {
    setIsModalOpen(true);
    setImageSrc(src);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setImageSrc("");
  };

  return (
    <div>
      {node.children.length ? (
        <div>
          <Button
            variant="link"
            onClick={handleToggle}
            aria-controls={`node-${node.id}`}
            aria-expanded={open}
          >
            {node.name}
            {node.timestamp}
            {node.image}
          </Button>
          <Collapse in={open}>
            <div style={styles} id={`node-${node.id}`}>
              {node.children.map((child) => (
                <TreeNode key={child.id} node={child} />
              ))}
            </div>
          </Collapse>
        </div>
      ) : (
        <div>
          <img
            src={`http://contest.elecard.ru/frontend_data/${node.image}`}
            className="tree-view-img-thumbnail"
            onClick={() => handleThumbnailClick(node.image)}
            alt="A description of the image"
          />
          &nbsp;
          <Modal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            imageSrc={imageSrc}
          />
          <span className="card-title text-secondary">
            FileSize:&nbsp;
            <span className="text-body">
              {getFileConversion(node.filesize)}&nbsp;
            </span>
          </span>
          <span className="card-title text-secondary">
            Date: &nbsp;
            <span className="text-body">
              {getDateFromTimestamp(node.timestamp)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

function ListView() {
  const [generalData, setGeneralData] = useState();
  const [treeData, setFormattedTreeData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(fetchUrl);
    const data = await response.json();
    if (data) {
      setIsLoading(false);
      setGeneralData(data);
      setTreeData(data);
    }
  };

  const setTreeData = (data) => {
    const treeData = [
      {
        id: 0,
        name: "All Categories",
        children: Object.values(
          data.reduce((accumulator, currentValue, index) => {
            if (accumulator[currentValue.category] === undefined) {
              accumulator[currentValue.category] = {
                name: currentValue.category,
                id: index,
                children: [],
              };
            }
            accumulator[currentValue.category].children.push({
              id: index,
              name: currentValue.image,
              image: currentValue.image,
              filesize: currentValue.filesize,
              timestamp: currentValue.timestamp,
              children: [],
            });
            return accumulator;
          }, {})
        ),
      },
    ];
    setFormattedTreeData(treeData);
  };

  return (
    <div className="container">
      {isLoading ? (
        <ProgressBar />
      ) : (
        <div>
          {treeData &&
            treeData.map((root) => <TreeNode key={root.id} node={root} />)}
        </div>
      )}
    </div>
  );
}

export default ListView;
