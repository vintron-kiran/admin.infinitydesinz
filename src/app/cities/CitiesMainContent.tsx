// src/app/cities/page.tsx
'use client';

import React from "react";

export default function CitiesPage() {
  return (
<div className="container-fluid px-5 py-4" style={{ maxWidth: '100%', margin: '0 auto' }}>
  <div className="row">
    <div className="col-lg-12">
            <div className="card">
              <div className="card-header py-3">
                <h5 className="text-dark mb-0">Create a Brand</h5>
                <a href="create-brand.php" className="btn btn-primary btn-sm">
                  Manage
                </a>
              </div>
              <div className="card-block">
                <form className="app-form ">
                  <div className="row d-flex justify-content-between align-items-center ">
                    <div className="col-lg-4 mb-3">
                      <label htmlFor="brand" className="form-label">
                        Brand
                      </label>
                      <input
                        id="brand"
                        name="brand"
                        placeholder="Enter Brand"
                        className="form-control"
                        type="text"
                        
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="form-control"
                      >
                        <option  disabled >
                          Select Status
                        </option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-lg-4 mt-3">
                      <button type="button" className="btn btn-success btn-sm">
                        + Add
                      </button>
                    </div>
                    <div className="col-lg-12 text-center my-4">
                      <button
                        type="submit"
                        className="btn btn-primary py-2 px-5"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
