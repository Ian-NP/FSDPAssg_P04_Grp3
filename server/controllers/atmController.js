const ATM = require("../models/atm"); // Import the ATM model
const axios = require("axios");
const haversine = require('haversine-distance');

class ATMController {
    // Controller function to get ATM information by ID
    static async getATMDetails(req, res) {
        const { atmId } = req.params;
        try {
            const atmData = await ATM.getATMInfo(atmId);
            if (atmData) {
                res.status(200).json(atmData);
            } else {
                res.status(404).json({ message: "ATM not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving ATM data", error });
        }
    }

    // Controller function to update remaining $10 and $50 notes
    static async updateATMNotes(req, res) {
        const { atmId } = req.params;
        const { remaining_10, remaining_50 } = req.body;

        try {
            await ATM.updateATMCash(atmId, remaining_10, remaining_50);
            res.status(200).json({ message: "ATM cash levels updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating ATM cash levels", error });
        }
    }

    // Controller function to create a new ATM
    static async createATM(req, res) {
        const { atmId, lat, lon, remaining_10, remaining_50 } = req.body;

        try {
            await ATM.createATM({ atmId, lat, lon, remaining_10, remaining_50 });
            res.status(201).json({ message: "ATM created successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error creating ATM", error });
        }
    }

    // Corrected controller function
    static async getNearestOCBCATM(req, res) {
        const { atmId } = req.params;
        const OCBC_API_URL = "https://api.ocbc.com/atm_locator/1.1";
        const ACCESS_TOKEN = "eyJ4NXQiOiJOREU1WXpjeFpEbGlNV1F6TXprd1ltVTJOekptWXpVMU5XRXhOVFkzWVRFME1EUm1OalE0WXciLCJraWQiOiJZVFJsTVRWbU16TTNNR1V6TVRsak4yTTFNamRtWlRCak5Ua3pNV0V4T0RjNE56VXlaVGd4WlRKallqWmlOek16WldRM1ltWXpNR1U0WTJGa01qa3hOZ19SUzI1NiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJJYW5OUCIsImF1dCI6IkFQUExJQ0FUSU9OIiwiYXVkIjoidmtERFJwZVBQaURwZnE0NndzVUw2TWZHakVFYSIsIm5iZiI6MTczMTQyOTI1MCwiYXpwIjoidmtERFJwZVBQaURwZnE0NndzVUw2TWZHakVFYSIsInNjb3BlIjoiZGVmYXVsdCIsImlzcyI6Imh0dHBzOlwvXC9hcGkub2NiYy5jb21cL29hdXRoMlwvdG9rZW4iLCJleHAiOjE3MzE0MzAxNTAsImlhdCI6MTczMTQyOTI1MCwianRpIjoiN2EwY2Q3MDMtZjI1Ny00ZDc4LWI2NTctZDU0NWYwMjFmODQ5In0.zjH02EvJR5j0UYvZM0DesL8cg3TEtdrXIo3plaqeAujauH8Ma8hQQCQPg4RdAUnd4B3gHHut70xISOiRnwyBd5oBg49qAH6pIiNZLe3ZbIOLe1YOVMMmVDntoDIU_qIuNjbZkly1q1haxbfzuKkNbMERivTd9PrVRl1Vv9ceA-sJoDRob-gI_ZJXjmeXTk8hNMwoOzesXNM8B9kf7HGEMWU7XtRbsIAKJEuE8JASPN9ns-q9Ok2QAzDAWpWNjZ9WsA-bhO2acZ15h6MKAfWGRJcR4BelFDHKURfvftTuKSrTdfmhc44oW0lon4PfxbYo9mhLPfcL0GqkKNnM4KowJg"; // Replace with your actual access token

        try {
            // Get the chosen ATM's location data
            const atmData = await ATM.getATMInfo(atmId);

            if (!atmData) {
                return res.status(404).json({ message: "ATM not found" });
            }

            const { lat, lon } = atmData;
            const currentLocation = { latitude: lat, longitude: lon };

            // Call the OCBC API to get the list of nearby ATMs
            const response = await axios.get(OCBC_API_URL, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                },
                params: {
                    latitude: lat,
                    longitude: lon,
                    radius: 5, // Example radius in km, adjust as needed
                    country: "SG", // Country code for Singapore
                    category: 1 // Filter for ATMs
                }
            });

            // Check if the API returned a list of ATMs
            if (response.data && response.data.atmList && response.data.atmList.length > 0) {
                // Filter out the current ATM and duplicates
                const filteredATMs = response.data.atmList.filter(atm => {
                    // Exclude the current ATM based on latitude and longitude
                    return !(atm.latitude === lat && atm.longitude === lon);
                });

                if (filteredATMs.length === 0) {
                    return res.status(404).json({ message: "No other nearby OCBC ATMs found" });
                }

                // Calculate distances and find the nearest ATM
                const nearestATM = filteredATMs.reduce((nearest, atm) => {
                    const atmLocation = { latitude: atm.latitude, longitude: atm.longitude };
                    const distance = haversine(currentLocation, atmLocation);

                    // Update the nearest if the current ATM is closer
                    if (!nearest || distance < nearest.distance) {
                        return { ...atm, distance };
                    }
                    return nearest;
                }, null);

                // Return the nearest ATM details
                return res.status(200).json(nearestATM);
            } else {
                return res.status(404).json({ message: "No nearby OCBC ATMs found" });
            }
        } catch (error) {
            console.error("Error fetching nearest OCBC ATM:", error);
            res.status(500).json({ message: "Error fetching nearest OCBC ATM", error: error.message });
        }
    }
}

module.exports = ATMController;
