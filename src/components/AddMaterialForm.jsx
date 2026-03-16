import React, { useState } from 'react';

/**
 * Add Material Form Component
 * Form to add educational materials when creating a new subject
 * Supports multiple file types: PDF, PowerPoint, Word, Text, etc.
 */
const AddMaterialForm = ({ onAddMaterial }) => {
  const [material, setMaterial] = useState({
    title: '',
    content: '',
    type: 'text',
    lessonNumber: 1,
    fileName: '',
    fileSize: 0
  });

  const handleSubmit = () => {
    console.log('Add Lesson clicked with material:', material);
    
    if (!material.title.trim()) {
      alert('Please enter a lesson title');
      return;
    }

    if (!material.content.trim()) {
      alert('Please add lesson content or upload a file');
      return;
    }

    // Call parent function to add material
    console.log('Calling onAddMaterial with:', material);
    onAddMaterial(material);
    
    // Reset form but keep incremented lesson number
    const nextLessonNumber = material.lessonNumber + 1;
    setMaterial({
      title: '',
      content: '',
      type: 'text',
      lessonNumber: nextLessonNumber,
      fileName: '',
      fileSize: 0
    });

    alert('Lesson added successfully!');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileSize = file.size;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      // Set material type based on file extension
      let materialType = 'file';
      if (['pdf'].includes(fileExtension)) {
        materialType = 'pdf';
      } else if (['ppt', 'pptx'].includes(fileExtension)) {
        materialType = 'powerpoint';
      } else if (['doc', 'docx'].includes(fileExtension)) {
        materialType = 'word';
      } else if (['txt', 'md'].includes(fileExtension)) {
        materialType = 'text';
      }

      // For text files, read content
      if (['txt', 'md'].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMaterial(prev => ({
            ...prev,
            content: e.target.result,
            title: prev.title || fileName.replace(/\.[^/.]+$/, ""),
            type: materialType,
            fileName: fileName,
            fileSize: fileSize
          }));
        };
        reader.readAsText(file);
      } else {
        // For other files, store file info
        setMaterial(prev => ({
          ...prev,
          content: `File uploaded: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`,
          title: prev.title || fileName.replace(/\.[^/.]+$/, ""),
          type: materialType,
          fileName: fileName,
          fileSize: fileSize
        }));
      }
    }
  };

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'powerpoint': return '📊';
      case 'word': return '📝';
      case 'text': return '📃';
      case 'link': return '🔗';
      default: return '📁';
    }
  };

  const getSupportedFormats = () => {
    return '.pdf,.ppt,.pptx,.doc,.docx,.txt,.md';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
      <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Add Study Material</h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lesson Title *
            </label>
            <input
              type="text"
              value={material.title}
              onChange={(e) => setMaterial(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Introduction to Algebra"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lesson Number *
            </label>
            <input
              type="number"
              value={material.lessonNumber}
              onChange={(e) => setMaterial(prev => ({ ...prev, lessonNumber: parseInt(e.target.value) }))}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Material Type
          </label>
          <select
            value={material.type}
            onChange={(e) => setMaterial(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="text">Text Content</option>
            <option value="file">Upload File</option>
            <option value="link">External Link</option>
          </select>
        </div>

        {material.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lesson Content *
            </label>
            <textarea
              value={material.content}
              onChange={(e) => setMaterial(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your lesson content here..."
              rows="4"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        )}

        {material.type === 'file' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Upload File *
            </label>
            <input
              type="file"
              accept={getSupportedFormats()}
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Supported formats:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">📄 PDF</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">📊 PowerPoint</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">📝 Word</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">📃 Text</span>
              </div>
            </div>
            {material.content && material.fileName && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded border text-sm">
                <p className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  {getFileTypeIcon(material.type)} 
                  ✅ File uploaded: {material.fileName} 
                  ({(material.fileSize / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>
        )}

        {material.type === 'link' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Material Link *
            </label>
            <input
              type="url"
              value={material.content}
              onChange={(e) => setMaterial(prev => ({ ...prev, content: e.target.value }))}
              placeholder="https://example.com/lesson"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            Add Lesson
          </button>
          <button
            type="button"
            onClick={() => setMaterial({ 
              title: '', 
              content: '', 
              type: 'text', 
              lessonNumber: 1, 
              fileName: '', 
              fileSize: 0 
            })}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialForm;