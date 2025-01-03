const { getAllFaceIDs, createFaceID, updateFaceID } = require("../models/faceDescriptor");

/**
 * Get all face IDs and their associated descriptors.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getAllFaceIDsController = async (req, res) => {
  try {
    const faceIDs = await getAllFaceIDs();
    res.status(200).json({
      success: true,
      faceIds: faceIDs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve face IDs",
      error: error.message
    });
  }
};

/**
 * Create a new face descriptor (auto-generates faceId using Firebase).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const createFaceIDController = async (req, res) => {
    const { faceDescriptor } = req.body;
    console.log("Received face descriptor:", faceDescriptor);
  
    // Ensure descriptors are provided in the request
    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      console.error("Invalid face descriptor: ", faceDescriptor);
      return res.status(400).json({
        success: false,
        message: "Invalid request data. 'descriptors' are required and must be an array."
      });
    }
  
    try {
      console.log("Attempting to create Face ID with descriptor: ", faceDescriptor);
      const faceId = await createFaceID(faceDescriptor);  // Make sure createFaceID is working correctly
      console.log("Face ID created successfully:", faceId);
  
      res.status(200).json({
        success: true,
        message: "Face ID created successfully.",
        faceId: faceId, // Return the newly created faceId
      });
    } catch (error) {
      console.error("Error creating Face ID:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to create face ID",
        error: error.message,
      });
    }
  }; 

/**
 * Update an existing face descriptor with a given faceId.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const updateFaceIDController = async (req, res) => {
  const { faceId, descriptors } = req.body;

  // Ensure faceId and descriptors are provided in the request
  if (!faceId || !descriptors || !Array.isArray(descriptors)) {
    return res.status(400).json({
      success: false,
      message: "'faceId' and 'descriptors' are required."
    });
  }

  try {
    await updateFaceID(faceId, descriptors);
    res.status(200).json({
      success: true,
      message: `Face ID ${faceId} updated successfully.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update face ID",
      error: error.message
    });
  }
};

module.exports = {
  getAllFaceIDsController,
  createFaceIDController,
  updateFaceIDController
};
