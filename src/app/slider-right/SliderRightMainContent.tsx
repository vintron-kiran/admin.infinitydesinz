'use client';

import { useEffect, useState } from 'react';
import { fetchSlider, updateSlider } from './service';
import { SliderRight } from './types';

export default function SliderRightMainContent() {
  const [slider, setSlider] = useState<SliderRight | null>(null);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [preview, setPreview] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSlider();
        setSlider(data);
        setPreview([
          data.image1 ? process.env.NEXT_PUBLIC_API_UPLOADS_URL + '/slider-right/'+ data.image1 : '',
          data.image2 ? process.env.NEXT_PUBLIC_API_UPLOADS_URL + '/slider-right/'+ data.image2 : '',
          data.image3 ? process.env.NEXT_PUBLIC_API_UPLOADS_URL + '/slider-right/'+ data.image3 : '',
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    const newPreview = [...preview];
    newPreview[index] = file ? URL.createObjectURL(file) : newPreview[index];
    setPreview(newPreview);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Ensure there's at least one file to upload
    if (!files.some((f) => f)) {
      alert('Please choose at least one file before updating.');
      return;
    }
    const formData = new FormData();
    files.forEach((file, idx) => {
      if (file) {
        // append using distinct field names matching backend
        formData.append(`image${idx + 1}`, file);
      }
    });

    try {
      const updated = await updateSlider(formData);
      alert('Updated successfully!');
      setSlider(updated);
    } catch (error) {
      console.error('Update failed:', error);
      alert('There was an error updating the slider.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid px-5 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">Update Slider Right</h4>
      </div>

      <div className="card-block">
        <form className="app-form mt-3" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="choose-file-box">
                <img
                  id="preview1"
                  src={preview[0] }
                  alt="Image 1 Preview"
                />
                <div>
                  <label htmlFor="image1" className="form-label">
                    Choose File
                  </label>
                  <input
                    id="image1"
                    name="image1"
                    className="form-control image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(0, e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="choose-file-box">
                <img
                  id="preview2"
                  src={preview[1] }
                  alt="Image 2 Preview"
                />
                <div>
                  <label htmlFor="image2" className="form-label">
                    Choose File
                  </label>
                  <input
                    id="image2"
                    name="image2"
                    className="form-control image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(1, e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="choose-file-box-full">
                <div className="row">
                  <div className="col-md-8">
                    <img
                      id="preview3"
                      src={preview[2] }
                      alt="Image 3 Preview"
                    />
                  </div>
                  <div className="col-md-4 pt-3">
                    <label htmlFor="image3" className="form-label">
                      Choose File
                    </label>
                    <input
                      id="image3"
                      name="image3"
                      className="form-control image-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(2, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 text-center">
              <button
                type="submit"
                className="submit-btn"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
