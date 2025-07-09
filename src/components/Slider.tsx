import React from "react";

export default function Slider() {
  return (
    <>
      <div className="content-wrapper">
        <div className="main-header" style={{ marginTop: 0 }}>
          <h4> Brands </h4>{" "}
          <a href="index.php">
            &nbsp;&nbsp;&nbsp;
            <i className="icon-home" />
            &nbsp;
          </a>
          <ol className="breadcrumb breadcrumb-title breadcrumb-arrow">
            <li className="breadcrumb-item">
              <a href="#">&nbsp;Manage</a>
            </li>
          </ol>
        </div>
        <div className="container-fluid manage">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-block manage-btn">
                  <div className="row ">
                    <div className="col-md-3">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search By "
                        />
                        <span className="input-group-btn" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <select className="form-control">
                        <option value>- Select Status -</option>
                        <option value="active">Active</option>
                        <option value="inactive">In Active</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-danger">
                        <i className="ti-search" />
                      </button>
                      <button className="btn btn-success">
                        <i className="icon-refresh" />
                      </button>
                    </div>
                    <div className="col-md-4 text-end">
                      <a
                        href="addBrand.php"
                        className="btn-primary"
                        type="button"
                      >
                        + Add New
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              {/* Basic Table starts */}
              <div className="card">
                <div className="card-block">
                  <div className="row mb-3">
                    <div className="col-lg-6">
                      <h5>Brands </h5>
                    </div>
                    <div className="col-md-6 text-right pt">
                      <button className="btn btn-success">Active</button>
                      <button className="btn btn-default">In Active</button>
                      <button className="btn btn-danger">Front Active</button>
                      <button className="btn btn-warning">
                        Front In Active
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 table-responsive">
                      <table className="table-lg table-striped align-middle mb-0 table table-hover">
                        <thead>
                          <tr>
                            <th>
                              <input type="checkbox" id="select-all" />
                            </th>
                            <th>S.No</th>
                            <th>Brands</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input type="checkbox" className="row-checkbox" />
                            </td>
                            <td>1</td>
                            <td>Godrej Interio</td>
                            <td>
                              <span className="badge text-light-primary">
                                Active
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-light-success icon-btn b-r-4"
                              >
                                <i className="ti-pencil-alt text-success" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light-danger icon-btn b-r-4 delete-btn"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input type="checkbox" className="row-checkbox" />
                            </td>
                            <td>2</td>
                            <td>Durian</td>
                            <td>
                              <span className="badge text-light-danger">
                                In Active
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-light-success icon-btn b-r-4"
                              >
                                <i className="ti-pencil-alt text-success" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light-danger icon-btn b-r-4 delete-btn"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input type="checkbox" className="row-checkbox" />
                            </td>
                            <td>3</td>
                            <td>Pepperfry</td>
                            <td>
                              <span className="badge text-light-primary">
                                Active
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-light-success icon-btn b-r-4"
                              >
                                <i className="ti-pencil-alt text-success" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light-danger icon-btn b-r-4 delete-btn"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input type="checkbox" className="row-checkbox" />
                            </td>
                            <td>4</td>
                            <td>Nilkamal</td>
                            <td>
                              <span className="badge text-light-primary">
                                Active
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-light-success icon-btn b-r-4"
                              >
                                <i className="ti-pencil-alt text-success" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light-danger icon-btn b-r-4 delete-btn"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input type="checkbox" className="row-checkbox" />
                            </td>
                            <td>5</td>
                            <td>Urban Ladder</td>
                            <td>
                              <span className="badge text-light-primary">
                                Active
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-light-success icon-btn b-r-4"
                              >
                                <i className="ti-pencil-alt text-success" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light-danger icon-btn b-r-4 delete-btn"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Basic Table ends */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
