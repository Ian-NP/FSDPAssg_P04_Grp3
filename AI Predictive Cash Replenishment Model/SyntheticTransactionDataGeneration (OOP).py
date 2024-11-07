import random
import datetime
import csv
import matplotlib.pyplot as plt
import pandas as pd
from collections import Counter

class ATM:
    def __init__(self, atm_id, location, location_type):
        # Initialize the ATM with basic information
        self.atm_id = atm_id
        self.location = location
        self.location_type = location_type
        self.atm_max_capacity = self.get_max_capacity(location_type)
        self.remaining_notes = self.initialize_remaining_notes(location_type)
        self.transactions = []

    # Define ATM location types and their respective multipliers
    atm_location_types = {
        'shopping_mall': (1.4, 1.6),
        'residential_area': (0.8, 1.2),
        'commercial_district': (1.2, 1.4),
    }

    # Initialize the ATM's remaining notes based on location type
    def initialize_remaining_notes(self, location_type):
        initial_notes = {}
        if location_type == 'shopping_mall':
            initial_notes = {100: 100, 50: 200, 10: 200, 5: 100, 2: 100}
        elif location_type == 'residential_area':
            initial_notes = {50: 150, 10: 150}
        else:  # commercial_district
            initial_notes = {100: 150, 50: 300, 10: 300, 5: 150, 2: 150}
        
        return initial_notes

    # Get maximum capacity of the ATM based on location type
    def get_max_capacity(self, location_type):
        return self.initialize_remaining_notes(location_type)

    # Check if a date is a public holiday
    def is_public_holiday(self, date):
        public_holidays = [
            datetime.date(2023, 1, 1), datetime.date(2023, 1, 2),
            datetime.date(2023, 1, 22), datetime.date(2023, 1, 23),
            datetime.date(2023, 1, 24), datetime.date(2023, 4, 7),
            datetime.date(2023, 4, 22), datetime.date(2023, 5, 1),
            datetime.date(2023, 6, 2), datetime.date(2023, 6, 29),
            datetime.date(2023, 8, 9), datetime.date(2023, 9, 1),
            datetime.date(2023, 11, 12), datetime.date(2023, 11, 13),
            datetime.date(2023, 12, 25)
        ]
        return date in public_holidays

    # Generate the previous 3 days sequence of holiday or weekday for given date
    def generate_holiday_sequence(self, date):
        prev_days = [date - datetime.timedelta(days=i) for i in range(3)]
        sequence = ''.join(['H' if self.is_public_holiday(d) or d.weekday() >= 5 else 'W' for d in prev_days])
        return sequence

    # Function to replenish ATM notes if they fall below a threshold
    def replenish_atm_notes(self, threshold=0.1):
        replenished_notes = self.remaining_notes.copy()
        replenished = False
        
        for denom, count in self.remaining_notes.items():
            if count < 200 * threshold:
                replenished_notes[denom] = 200
                replenished = True
        
        self.remaining_notes = replenished_notes
        return replenished
    
    def getLocationMultiplier(self):
        return random.uniform(*self.atm_location_types[self.location_type])
    
    def distribute_transactions(self, transaction_count):
        # Randomly choose a peak percentage between 70% and 80%
        peak_percentage = random.uniform(0.7, 0.8)
        peak_transactions = int(transaction_count * peak_percentage)
        non_peak_transactions = transaction_count - peak_transactions
        return peak_transactions, non_peak_transactions

    # Get valid transaction amount based on the available notes
    def get_valid_transaction_amount(self, transaction_amount):
        if all(count == 0 for count in self.remaining_notes.values()):
            print("Error: All ATM denominations are empty. Unable to process transaction.")
            return None

        # Create a shallow copy of remaining_notes to avoid modifying the original
        remaining_notes_copy = self.remaining_notes.copy()

        available_denoms = [denom for denom, count in remaining_notes_copy.items() if count > 0]
        available_denoms.sort(reverse=True)

        closest_valid_amount = 0
        remaining_amount = transaction_amount
        # print("Transaction_Amount: " + str(transaction_amount))

        for denom in available_denoms:
            while remaining_amount >= denom and remaining_notes_copy[denom] > 0:
                closest_valid_amount += denom
                remaining_amount -= denom
                remaining_notes_copy[denom] -= 1
                if remaining_amount == 0:
                    break
            if remaining_amount == 0:
                break

        # print("closest_valid_amount: " + str(closest_valid_amount))
        return closest_valid_amount if closest_valid_amount != 0 else None
    
    def getHolidayMultiplier(self, holiday_sequence, is_holiday):
        holiday_multiplier = random.uniform(0.8, 1.5)
        if holiday_sequence == "HWW" or holiday_sequence == "WHH":
            holiday_multiplier = random.uniform(1.1, 1.5)
        elif holiday_sequence == "HHW":
            holiday_multiplier = random.uniform(0.5, 0.8)
        elif holiday_sequence == "WWW":
            holiday_multiplier = random.uniform(1.0, 1.3)
        elif is_holiday:
            holiday_multiplier = random.uniform(0.8, 1.2)
        
        return holiday_multiplier
    
    def getSpecialEventMultiplier(self, date):
        special_event_dates = [datetime.date(2023, 1, 22), datetime.date(2023, 4, 22)]
        special_event_multiplier = 1
        if date in special_event_dates:
            special_event_multiplier = random.uniform(0.8, 1.2)
        elif date in [d - datetime.timedelta(days=i) for i in range(1, 8) for d in special_event_dates]:
            special_event_multiplier = random.uniform(1.2, 1.5)
        
        return special_event_multiplier
    
    def generate_transaction(self, date):
        weekday = date.weekday()
        holiday_sequence = self.generate_holiday_sequence(date)
        is_holiday = self.is_public_holiday(date)
        
        holiday_multiplier = self.getHolidayMultiplier(holiday_sequence, is_holiday)
        location_multiplier = self.getLocationMultiplier()
        special_event_multiplier = self.getSpecialEventMultiplier(date)

        # Determine transaction count based on holiday and day of the week
        if holiday_sequence == "HWW" or holiday_sequence == "WHH":
            transaction_count = random.randint(40, 80)
        elif holiday_sequence == "HHW":
            transaction_count = random.randint(10, 50)
        elif holiday_sequence == "WWW":
            transaction_count = random.randint(20, 50)
        elif is_holiday:
            transaction_count = random.randint(30, 70)
        elif weekday in [5, 6]:  # Weekend
            transaction_count = random.randint(20, 60)
        else:
            transaction_count = random.randint(10, 50)

        transaction_count = int(transaction_count * special_event_multiplier * location_multiplier)
        print(f"Transaction count for {date}: {transaction_count}")
        peak_transactions, non_peak_transactions = self.distribute_transactions(transaction_count)

        # Adjust for peak/non-peak hours (higher transactions during peak hours)
        peak_hours = [(7, 9), (12, 14), (17, 19), (19, 22)]  # Peak hours (start, end) time ranges
        non_peak_hours = [(0, 7), (10, 12), (15, 17), (22, 24)]  # Non-peak hours ranges

        # Generate transactions with specific timings
        peak_transactions_data = self.generate_random_transactions(peak_transactions, date, peak_hours, special_event_multiplier, location_multiplier, weekday, holiday_sequence, is_holiday)
        non_peak_transactions_data = self.generate_random_transactions(non_peak_transactions, date, non_peak_hours, special_event_multiplier, location_multiplier, weekday, holiday_sequence, is_holiday)

        # Combine peak and non-peak transactions and shuffle for randomness
        all_transactions = peak_transactions_data + non_peak_transactions_data
        random.shuffle(all_transactions)

        self.replenish_atm_notes()
        return all_transactions
    
    def generate_random_transactions(self, transaction_count, date, time_slots, special_event_multiplier=1, location_multiplier=1, weekday=None, holiday_sequence=None, is_holiday=None):
        transaction_data = []
        transactionCountPerSlot = max(int(transaction_count / len(time_slots)), 1)
        
        for i in range(len(time_slots)):
            for _ in range(transactionCountPerSlot):
                # Choose a random time slot
                start_hour, end_hour = random.choice(time_slots)

                # Randomize the hour and minute within the chosen time slot
                hour = random.randint(start_hour, end_hour - 1)
                minute = random.randint(0, 59)
                transaction_time = datetime.time(hour=hour, minute=minute)

                # 0.1% chance of a high-value transaction (e.g., $500, $1000, $2000)
                if random.random() < 0.001:
                    transaction_amount = random.choice([500, 1000, 2000])
                else:
                    if (self.location_type == "shopping_mall"):
                        transaction_amount = random.choices([10, 50, 75, 100, 200], weights=[0.1, 0.15, 0.1, 0.35, 0.3], k=1)[0]
                    elif (self.location_type == "residential_area"):
                        transaction_amount = random.choices([10, 50, 75, 100, 200], weights=[0.1, 0.35, 0.1, 0.35, 0.1], k=1)[0]
                    elif (self.location_type == "commercial_district"):
                        transaction_amount = random.choices([10, 50, 75, 100, 200], weights=[0.1, 0.2, 0.1, 0.35, 0.25], k=1)[0]
                    if random.random() < 0.15:
                        transaction_amount *= (special_event_multiplier * location_multiplier)
                valid_transaction_amount = self.get_valid_transaction_amount(transaction_amount)
                tempTransactionAmount = valid_transaction_amount
                # print("Valid Transaction Amount: " + str(valid_transaction_amount))

                if valid_transaction_amount is None:
                    x = 1
                    # print("Error: No valid transaction can be made due to empty ATM denominations.")
                else:   
                    for denom in sorted(self.remaining_notes.keys(), reverse=True):
                        while tempTransactionAmount >= denom and self.remaining_notes[denom] > 0:
                            self.remaining_notes[denom] -= 1
                            tempTransactionAmount -= denom
                            if tempTransactionAmount == 0:
                                break

                transaction_data.append({
                    "atm_id": self.atm_id,
                    "date": date,
                    "time": transaction_time,
                    "weekday": weekday,
                    "holiday_sequence": holiday_sequence,
                    "is_holiday": is_holiday,
                    "special_event": special_event_multiplier > 1,  # True if there's a special event
                    "transaction_amount": valid_transaction_amount if valid_transaction_amount not in [None] else int(transaction_amount),
                    "location_type": self.location_type,
                    "status": valid_transaction_amount is not None,  # True if transaction is valid, False otherwise
                    **{f"remaining_{denom}_notes": self.remaining_notes.get(denom, 0) for denom in self.remaining_notes},
                    "atm_capacity": self.atm_max_capacity
                })

        return transaction_data



import datetime
import csv

# Define ATM types and locations
atm_types = [
    {"id": 1, "location": "11 Canberra Rd, Singapore 759775", "location_type": "shopping_mall"},
    {"id": 2, "location": "33 Ang Mo Kio Ave 3, Singapore 569933", "location_type": "residential_area"},
    {"id": 3, "location": "1 Raffles Place, Singapore 048616", "location_type": "commercial_district"},
]

# Define date range for transaction generation
start_date = datetime.date(2023, 1, 1)
end_date = datetime.date(2023, 12, 31)

# Open CSV file for writing transaction data
with open("atm_transactions.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    # Write header row for CSV
    writer.writerow([
        "atm_id", "date", "time", "weekday", "holiday_sequence", "is_holiday", "special_event",
        "transaction_amount", "location_type", "status", "atm_capacity",
        "remaining_notes_10", "remaining_notes_50", "remaining_notes_100"
    ])
    
    # Loop through each ATM type
    for atm_info in atm_types:
        # Create an ATM object for each type
        atm = ATM(atm_id=atm_info["id"], location=atm_info["location"], location_type=atm_info["location_type"])
        
        # Generate transactions for each day within the date range
        current_date = start_date
        while current_date <= end_date:
            transactions = atm.generate_transaction(current_date)
            if transactions:  # Ensure transactions are not None
                # Write each transaction to the CSV file
                for transaction in transactions:
                    writer.writerow([
                        transaction["atm_id"], transaction["date"], transaction["time"], transaction["weekday"],
                        transaction["holiday_sequence"], transaction["is_holiday"], transaction["special_event"],
                        transaction["transaction_amount"], transaction["location_type"], transaction["status"],
                        transaction["atm_capacity"], transaction.get("remaining_10_notes", 0), transaction.get("remaining_50_notes", 0),
                        transaction.get("remaining_100_notes", 0)
                    ])
            current_date += datetime.timedelta(days=1)

print("Transactions for all ATM types have been saved to atm_transactions.csv.")