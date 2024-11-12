const { getDatabase, ref, get, set, update, push } = require("firebase/database");
const { database } = require("../firebase"); // Import the initialized database instance

class ATM {
    constructor({ atmId, lat, lon, remaining_10, remaining_50 }) {
        this.atmId = atmId;
        this.lat = lat;
        this.lon = lon;
        this.remaining_10 = remaining_10;
        this.remaining_50 = remaining_50;
    }

    // Method to get ATM information by atmId
    static async getATMInfo(atmId) {
        try {
            const dbRef = ref(database, `ATMs/${atmId}`);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No ATM data found for this ID.");
                return null;
            }
        } catch (error) {
            console.error("Error getting ATM data:", error);
            throw error;
        }
    }

    // Method to update the remaining $10 and $50 notes
    static async updateATMCash(atmId, newRemaining10, newRemaining50) {
        try {
            const dbRef = ref(database, `ATMs/${atmId}`);
            await update(dbRef, {
                remaining_10: newRemaining10,
                remaining_50: newRemaining50,
            });
            console.log("ATM cash levels updated successfully.");
        } catch (error) {
            console.error("Error updating ATM cash levels:", error);
            throw error;
        }
    }

    // Method to create a new ATM entry
    static async createATM({ atmId, lat, lon, remaining_10, remaining_50 }) {
        try {
            const dbRef = ref(database, `ATMs/${atmId}`);
            await set(dbRef, {
                atmId,
                lat,
                lon,
                remaining_10,
                remaining_50,
            });
            console.log("New ATM created successfully.");
        } catch (error) {
            console.error("Error creating ATM:", error);
            throw error;
        }
    }
}

module.exports = ATM;
