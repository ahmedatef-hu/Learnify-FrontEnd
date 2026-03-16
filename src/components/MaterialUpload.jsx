import React, { useState } from 'react';
import { Storage } from '../utils/storage';

/**
 * Material Upload Component
 * Allows users to upload study materials for each subject
 */
const MaterialUpload = ({ subjectName, onMaterialAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [materials, setMaterials] = useState(() => {
    const savedMaterials = Storage.getMaterials(subjectName) || [];
    return savedMaterials;
  });

  // Refresh materials when component mounts or subject changes
  React.useEffect(() => {
    const savedMaterials = Storage.getMaterials(subjectName) || [];
    setMaterials(savedMaterials);
  }, [subjectName]);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    content: '',
    type: 'text', // text, pdf, link
    lessonNumber: 1
  });

  const handleAddMaterial = () => {
    if (!newMaterial.title.trim() || !newMaterial.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const material = {
      id: Date.now().toString(),
      title: newMaterial.title.trim(),
      content: newMaterial.content.trim(),
      type: newMaterial.type,
      lessonNumber: parseInt(newMaterial.lessonNumber) || 1,
      dateAdded: new Date().toISOString(),
      subjectName
    };

    try {
      const updatedMaterials = [...materials, material];
      setMaterials(updatedMaterials);
      const saveSuccess = Storage.saveMaterials(subjectName, updatedMaterials);
      
      if (!saveSuccess) {
        throw new Error('Failed to save to storage');
      }
      
      // Reset form
      setNewMaterial({
        title: '',
        content: '',
        type: 'text',
        lessonNumber: (materials.length + 1)
      });

      if (onMaterialAdded) {
        onMaterialAdded(material);
      }

      alert('Material added successfully!');
      
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Failed to add material. Please try again.');
      // Revert state if save failed
      setMaterials(materials);
    }
  };

  const handleDeleteMaterial = (materialId) => {
    if (confirm('Are you sure you want to delete this material?')) {
      try {
        const updatedMaterials = materials.filter(m => m.id !== materialId);
        setMaterials(updatedMaterials);
        const saveSuccess = Storage.saveMaterials(subjectName, updatedMaterials);
        
        if (!saveSuccess) {
          throw new Error('Failed to save to storage');
        }
        
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete material. Please try again.');
        // Revert state if save failed
        setMaterials(materials);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please choose a file smaller than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          setNewMaterial(prev => ({
            ...prev,
            content: content,
            title: prev.title || file.name.replace(/\.[^/.]+$/, "") // Remove file extension
          }));
        } catch (error) {
          console.error('Error reading file:', error);
          alert('Failed to read file. Please try again.');
        }
      };
      
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
      >
        📚 Manage Materials ({materials.length})
      </button>

      {isOpen && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {subjectName} Materials
          </h3>

          {/* Add New Material Form */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Add New Material</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Lesson 1 - Introduction"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Lesson Number
                </label>
                <input
                  type="number"
                  value={newMaterial.lessonNumber}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, lessonNumber: e.target.value }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Material Type
              </label>
              <select
                value={newMaterial.type}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="text">Text</option>
                <option value="pdf">PDF File</option>
                <option value="link">Link</option>
              </select>
            </div>

            {newMaterial.type === 'text' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Lesson Content
                </label>
                <textarea
                  value={newMaterial.content}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your lesson content here..."
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            {newMaterial.type === 'pdf' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Upload Text File
                </label>
                <input
                  type="file"
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports text files (.txt, .md) - PDF support coming soon
                </p>
                {newMaterial.content && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border">
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✅ File loaded successfully ({newMaterial.content.length} characters)
                    </p>
                  </div>
                )}
              </div>
            )}

            {newMaterial.type === 'link' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Material Link
                </label>
                <input
                  type="url"
                  value={newMaterial.content}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="https://example.com/lesson"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            <button
              onClick={handleAddMaterial}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add Material
            </button>
          </div>

          {/* Materials List */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Added Materials</h4>
            {materials.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No materials added yet</p>
            ) : (
              <div className="space-y-3">
                {materials
                  .sort((a, b) => a.lessonNumber - b.lessonNumber)
                  .map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                            Lesson {material.lessonNumber}
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {material.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {material.type === 'text' && `${material.content.substring(0, 100)}...`}
                          {material.type === 'link' && material.content}
                          {material.type === 'pdf' && 'File uploaded'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="text-red-500 hover:text-red-700 transition ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialUpload;