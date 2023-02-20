import React, { useEffect, useState } from "react";
import { fetchUrl, imageUrl, SortingOptions } from "../../common/constants";
import { getDateFromTimestamp, getFileConversion } from "../../utils/utils";
import ReactPaginate from "react-paginate";
import ProgressBar from "../ProgressBar";

export default function GridView() {
  const [generalData, setGeneralData] = useState();
  const [sortOption, setSortOption] = useState(SortingOptions.SortByCategory);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 20;

  useEffect(() => {
    getUpdatedData();
  }, []);

  useEffect(() => {
    getUpdatedData();
  }, [pageNumber]);

  const getUpdatedData = async () => {
    const response = await fetch(fetchUrl);
    const data = await response.json();
    if (data) {
      setIsLoading(false);
      setGeneralData(
        data.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage)
      );
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      const deletedData = JSON.parse(localStorage.getItem("deletedData"));
      if (deletedData?.length) {
        const updatedData = updateData(data, deletedData);
        setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
        setGeneralData(
          updatedData.slice(
            pageNumber * itemsPerPage,
            (pageNumber + 1) * itemsPerPage
          )
        );
      }
    }
  };

  const deleteData = (data) => {
    const deletedData = JSON.parse(localStorage.getItem("deletedData"));
    if (deletedData?.length) {
      const updateLocalStorageData = [...deletedData, data];
      localStorage.setItem(
        "deletedData",
        JSON.stringify(updateLocalStorageData)
      );
    } else {
      const deletedData = [data];
      localStorage.setItem("deletedData", JSON.stringify(deletedData));
    }
    const dataToBeUpdated = JSON.parse(localStorage.getItem("deletedData"));
    setGeneralData(updateData(generalData, dataToBeUpdated));
  };

  const updateData = (data, deletedData) => {
    return data.filter(
      (ar) =>
        !deletedData.find(
          (rm) => rm.image === ar.image && ar.timestamp === rm.timestamp
        )
    );
  };

  const changeSortOption = (sortOption) => {
    setSortOption(sortOption);
    if (sortOption === SortingOptions.SortByCategory) {
      generalData.sort((first, second) => {
        const fileNameFirst = first.category;
        const fileNameSecond = second.category;

        if (fileNameFirst < fileNameSecond) {
          return -1;
        }
        if (fileNameFirst > fileNameSecond) {
          return 1;
        }
        return 0;
      });
    } else if (sortOption === SortingOptions.SortByDate) {
      generalData.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortOption === SortingOptions.SortByFileName) {
      generalData.sort((first, second) => {
        const fileNameFirst = first.image.split("/")[1];
        const fileNameSecond = second.image.split("/")[1];

        if (fileNameFirst < fileNameSecond) {
          return -1;
        }
        if (fileNameFirst > fileNameSecond) {
          return 1;
        }
        return 0;
      });
    } else if (sortOption === SortingOptions.SortByFileSize) {
      generalData.sort((a, b) => a.filesize - b.filesize);
    }
    setGeneralData(generalData);
  };

  const handlePageChange = (selectedPage) => {
    setPageNumber(selectedPage.selected);
  };

  return (
    <div className="container">
      {isLoading ? (
        <ProgressBar />
      ) : (
        <>
          <div className="my-4 text-center">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sortingOptions"
                id="sortByCategory"
                value="category"
                checked={sortOption === SortingOptions.SortByCategory}
                onClick={() => changeSortOption(SortingOptions.SortByCategory)}
              />
              <label className="form-check-label">Sort By Category</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sortingOptions"
                id="sortByDate"
                value="date"
                checked={sortOption === SortingOptions.SortByDate}
                onClick={() => changeSortOption(SortingOptions.SortByDate)}
              />
              <label className="form-check-label">Sort By Date</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sortingOptions"
                id="sortByFilename"
                value="filename"
                checked={sortOption === SortingOptions.SortByFileName}
                onClick={() => changeSortOption(SortingOptions.SortByFileName)}
              />
              <label className="form-check-label">Sort By Filename</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="sortingOptions"
                id="sortByFilesize"
                value="filesize"
                checked={sortOption === SortingOptions.SortByFileSize}
                onClick={() => changeSortOption(SortingOptions.SortByFileSize)}
              />
              <label className="form-check-label">Sort By Filesize</label>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4">
            {generalData &&
              generalData.map((data) => (
                <div className="col">
                  <div className="card">
                    <div className="card-header d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="card"
                        aria-label="Close"
                        onClick={() => deleteData(data)}
                      ></button>
                    </div>
                    <img
                      src={imageUrl + data.image}
                      className="grid-card-img"
                      alt={data.category}
                    />
                    <div className="card-body">
                      <p className="card-title text-secondary">
                        Category: &nbsp;{" "}
                        <span className="text-body">{data.category}</span>
                      </p>
                      <p className="card-title text-secondary">
                        FileSize: &nbsp;
                        <span className="text-body">
                          {getFileConversion(data.filesize)}
                        </span>
                      </p>
                      <p className="card-title text-secondary">
                        Date: &nbsp;
                        <span className="text-body">
                          {getDateFromTimestamp(data.timestamp)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {generalData && (
            <div className="my-3">
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"previous-link"}
                nextLinkClassName={"next-link"}
                disabledClassName={"disabled"}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
