import React, { useState } from "react";
import { DataViewPattern } from "../../common/constants";
import GridView from "./GridView";
import ListView from "./ListView";

export default function Content() {
  const [selectedView, setSelectedView] = useState("Grid");
  const changeView = (view) => {
    setSelectedView(view);
  };
  return (
    <div className="scrollable-content py-3 px-3">
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="listingOptions"
          id="gridView"
          value="Grid"
          checked={selectedView === DataViewPattern.Grid}
          onClick={() => changeView(DataViewPattern.Grid)}
        />
        <label className="form-check-label" htmlFor="gridView">
          Grid
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="listingOptions"
          id="listView"
          value="List"
          checked={selectedView === DataViewPattern.List}
          onClick={() => changeView(DataViewPattern.List)}
        />
        <label className="form-check-label" htmlFor="listView">
          List
        </label>
      </div>
      <div>
        {selectedView === DataViewPattern.Grid ? <GridView /> : <ListView />}
      </div>
    </div>
  );
}
