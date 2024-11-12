import pandas as pd
import numpy as np
from random import randint, choice
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
import calendar

# # Define possible ATM location types with the updated category
ATM_LOCATION_TYPES = [
    'MRT', 'Supermarket', 
    'Shopping', 'Residential'
]

ATM = {
    1: {
        'location_type': 'Residential',
        'address': '883 Woodlands Street 82 North Plaza 730883',
        'days_of_week': {
            'Monday': {
                'peak': [(5, 6)],
                'non_peak': [(0, 4), (6, 24)]
            },
            'Tuesday': {
                'peak': [(23, 24)],
                'non_peak': [(0, 22)]
            },
            'Wednesday': {
                'peak': [(14, 15)],
                'non_peak': [(0, 13), (15, 24)]
            },
            'Thursday': {
                'peak': [(7, 8)],
                'non_peak': [(0, 6), (8, 24)]
            },
            'Friday': {
                'peak': [(0, 1)],
                'non_peak': [(1, 24)]
            },
            'Saturday': {
                'peak': [(19, 20)],
                'non_peak': [(0, 18), (20, 24)]
            },
            'Sunday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            }
        }
    },
    2: {
        'location_type': 'Residential',
        'address': '103 Yishun Ring Road Singapore 760103',
        'days_of_week': {
            'Monday': {
                'peak': [(21, 22)],
                'non_peak': [(0, 20), (22, 24)]
            },
            'Tuesday': {
                'peak': [(4, 5)],
                'non_peak': [(0, 3), (5, 24)]
            },
            'Wednesday': {
                'peak': [(15, 16)],
                'non_peak': [(0, 14), (16, 24)]
            },
            'Thursday': {
                'peak': [(13, 14)],
                'non_peak': [(0, 12), (14, 24)]
            },
            'Friday': {
                'peak': [(15, 16)],
                'non_peak': [(0, 14), (16, 24)]
            },
            'Saturday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            },
            'Sunday': {
                'peak': [(12, 13)],
                'non_peak': [(0, 11), (13, 24)]
            }
        }
    },
    3: {
        'location_type': 'Supermarket',
        'address': '888 Woodlands Drive 50 Singapore 730888',
        'days_of_week': {
            'Monday': {
                'peak': [(2, 3)],
                'non_peak': [(0, 1), (3, 24)]
            },
            'Tuesday': {
                'peak': [(20, 21)],
                'non_peak': [(0, 19), (21, 24)]
            },
            'Wednesday': {
                'peak': [(23, 24)],
                'non_peak': [(0, 22)]
            },
            'Thursday': {
                'peak': [(23, 24)],
                'non_peak': [(0, 22)]
            },
            'Friday': {
                'peak': [(12, 13)],
                'non_peak': [(0, 11), (13, 24)]
            },
            'Saturday': {
                'peak': [(23, 24)],
                'non_peak': [(0, 22)]
            },
            'Sunday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            }
        }
    },
    4: {
        'location_type': 'Supermarket',
        'address': '768 Woodlands Ave 6, Singapore 730768',
        'days_of_week': {
            'Monday': {
                'peak': [(13, 14)],
                'non_peak': [(0, 12), (14, 24)]
            },
            'Tuesday': {
                'peak': [(15, 16)],
                'non_peak': [(0, 14), (16, 24)]
            },
            'Wednesday': {
                'peak': [(21, 22)],
                'non_peak': [(0, 20), (22, 24)]
            },
            'Thursday': {
                'peak': [(7, 8)],
                'non_peak': [(0, 6), (8, 24)]
            },
            'Friday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            },
            'Saturday': {
                'peak': [(14, 15)],
                'non_peak': [(0, 13), (15, 24)]
            },
            'Sunday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            }
        }
    },
    5: {
        'location_type': 'Supermarket',
        'address': 'Blk 511, Canberra Rd, #02-03, 750511',
        'days_of_week': {
            'Monday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            },
            'Tuesday': {
                'peak': [(18, 19)],
                'non_peak': [(0, 17), (19, 24)]
            },
            'Wednesday': {
                'peak': [(11, 12)],
                'non_peak': [(0, 10), (13, 24)]
            },
            'Thursday': {
                'peak': [(0, 1)],
                'non_peak': [(1, 23)]
            },
            'Friday': {
                'peak': [(9, 10)],
                'non_peak': [(0, 8), (10, 24)]
            },
            'Saturday': {
                'peak': [(14, 15)],
                'non_peak': [(0, 13), (15, 24)]
            },
            'Sunday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            }
        }
    },
    6: {
        'location_type': 'Supermarket',
        'address': '355 Sembawang Wy, Singapore 750355',
        'days_of_week': {
            'Monday': {
                'peak': [(18, 19)],
                'non_peak': [(0, 17), (19, 24)]
            },
            'Tuesday': {
                'peak': [(17, 18)],
                'non_peak': [(0, 16), (19, 24)]
            },
            'Wednesday': {
                'peak': [(11, 12)],
                'non_peak': [(0, 10), (13, 24)]
            },
            'Thursday': {
                'peak': [(6, 7)],
                'non_peak': [(0, 5), (7, 24)]
            },
            'Friday': {
                'peak': [(3, 4)],
                'non_peak': [(0, 2), (5, 24)]
            },
            'Saturday': {
                'peak': [(1, 2)],
                'non_peak': [(0, 0), (3, 24)]
            },
            'Sunday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            }
        }
    },
    7: {
        'location_type': 'MRT',
        'address': '70 Ave 7 Admiralty MRT Station 738344',
        'days_of_week': {
            'Monday': {
                'peak': [(13, 14)],
                'non_peak': [(0, 12), (14, 24)]
            },
            'Tuesday': {
                'peak': [(15, 16)],
                'non_peak': [(0, 14), (16, 24)]
            },
            'Wednesday': {
                'peak': [(21, 22)],
                'non_peak': [(0, 20), (22, 24)]
            },
            'Thursday': {
                'peak': [(7, 8)],
                'non_peak': [(0, 6), (8, 24)]
            },
            'Friday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            },
            'Saturday': {
                'peak': [(14, 15)],
                'non_peak': [(0, 13), (15, 24)]
            },
            'Sunday': {
                'peak': [(22, 23)],
                'non_peak': [(0, 21), (23, 24)]
            }
        }
    },
    8: {
        'location_type': 'MRT',
        'address': '11 Canberra Rd, Singapore 759775',
        'days_of_week': {
            'Monday': {
                'peak': [(17, 18)],
                'non_peak': [(0, 16), (19, 24)]
            },
            'Tuesday': {
                'peak': [(13, 14)],
                'non_peak': [(0, 12), (14, 24)]
            },
            'Wednesday': {
                'peak': [(9, 10)],
                'non_peak': [(0, 8), (10, 24)]
            },
            'Thursday': {
                'peak': [(15, 16)],
                'non_peak': [(0, 14), (16, 24)]
            },
            'Friday': {
                'peak': [(21, 22)],
                'non_peak': [(0, 20), (22, 24)]
            },
            'Saturday': {
                'peak': [(10, 11)],
                'non_peak': [(0, 9), (11, 24)]
            },
            'Sunday': {
                'peak': [(12, 13)],
                'non_peak': [(0, 11), (13, 24)]
            }
        }
    }
}

def is_public_holiday(current_time):
    # Define public holiday dates for 2020, 2021, 2022, 2023, and 2024 (as dates without time)
    public_holidays = {
        # 2024 holidays
        datetime(2024, 1, 1).date(),    # New Year's Day
        datetime(2024, 2, 10).date(),   # Chinese New Year (Start)
        datetime(2024, 2, 11).date(),   # Chinese New Year (End)
        datetime(2024, 3, 29).date(),   # Good Friday
        datetime(2024, 4, 10).date(),   # Hari Raya Puasa
        datetime(2024, 5, 1).date(),    # Labour Day
        datetime(2024, 5, 22).date(),   # Vesak Day
        datetime(2024, 6, 17).date(),   # Hari Raya Haji
        datetime(2024, 8, 9).date(),    # National Day
        datetime(2024, 10, 31).date(),  # Deepavali
        datetime(2024, 12, 25).date(),  # Christmas Day
        
        # 2023 holidays
        datetime(2023, 1, 22).date(),   # Chinese New Year (Start)
        datetime(2023, 1, 23).date(),   # Chinese New Year (End)
        datetime(2023, 1, 24).date(),   # Public holiday (if rest day falls on 23 January)
        datetime(2023, 4, 7).date(),    # Good Friday
        datetime(2023, 4, 22).date(),   # Hari Raya Puasa
        datetime(2023, 5, 1).date(),    # Labour Day
        datetime(2023, 6, 2).date(),    # Vesak Day
        datetime(2023, 6, 29).date(),   # Hari Raya Haji
        datetime(2023, 8, 9).date(),    # National Day
        datetime(2023, 9, 1).date(),    # Polling Day
        datetime(2023, 11, 13).date(),  # Deepavali (if rest day falls on 12 November)
        datetime(2023, 12, 25).date(),  # Christmas Day
        
        # 2022 holidays
        datetime(2022, 1, 1).date(),    # New Year's Day
        datetime(2022, 2, 1).date(),    # Chinese New Year (Start)
        datetime(2022, 2, 2).date(),    # Chinese New Year (End)
        datetime(2022, 4, 15).date(),   # Good Friday
        datetime(2022, 5, 1).date(),    # Labour Day
        datetime(2022, 5, 2).date(),    # Hari Raya Puasa
        datetime(2022, 5, 15).date(),   # Vesak Day
        datetime(2022, 7, 9).date(),    # Hari Raya Haji
        datetime(2022, 8, 9).date(),    # National Day
        datetime(2022, 10, 24).date(),  # Deepavali
        datetime(2022, 12, 25).date(),  # Christmas Day
        
        # 2021 holidays
        datetime(2021, 1, 1).date(),    # New Year's Day
        datetime(2021, 2, 12).date(),   # Chinese New Year (Start)
        datetime(2021, 2, 13).date(),   # Chinese New Year (End)
        datetime(2021, 4, 2).date(),    # Good Friday
        datetime(2021, 5, 1).date(),    # Labour Day
        datetime(2021, 5, 13).date(),   # Hari Raya Puasa
        datetime(2021, 5, 26).date(),   # Vesak Day
        datetime(2021, 7, 20).date(),   # Hari Raya Haji
        datetime(2021, 8, 9).date(),    # National Day
        datetime(2021, 11, 4).date(),   # Deepavali
        datetime(2021, 12, 25).date(),  # Christmas Day
        
        # 2020 holidays
        datetime(2020, 1, 1).date(),    # New Year's Day
        datetime(2020, 1, 25).date(),   # Chinese New Year (Start)
        datetime(2020, 1, 26).date(),   # Chinese New Year (End)
        datetime(2020, 4, 10).date(),   # Good Friday
        datetime(2020, 5, 1).date(),    # Labour Day
        datetime(2020, 5, 7).date(),    # Vesak Day
        datetime(2020, 5, 24).date(),   # Hari Raya Puasa
        datetime(2020, 7, 31).date(),   # Hari Raya Haji
        datetime(2020, 8, 9).date(),    # National Day
        datetime(2020, 11, 14).date(),  # Deepavali
        datetime(2020, 12, 25).date()   # Christmas Day
    }

    # Check if the date part of current_time is in the set of public holidays
    return current_time.date() in public_holidays

# Function to introduce realistic noise into data
def introduce_realistic_noise(df):
    # Duplicate random rows: Simulate accidental duplicate records
    duplicate_indices = np.random.choice(df.index, size=int(len(df) * 0.03), replace=False)  # 3% duplicates
    duplicate_rows = df.iloc[duplicate_indices]  # Select rows to duplicate
    df = pd.concat([df, duplicate_rows], ignore_index=True)  # Concatenate duplicate rows

    # Random outliers: Introduce extreme values in Total_Withdrawals and ATM_Cash_Level
    outlier_indices = np.random.choice(df.index, size=int(len(df) * 0.01), replace=False)  # 2% outliers
    for idx in outlier_indices:
        if np.random.random() > 0.5:
            df.loc[idx, 'Total_Withdrawals'] = np.random.randint(10000, 15000)  # Outlier for withdrawals

    # Random time gaps: Simulate missing data for a few hours or days
    missing_time_indices = np.random.choice(df.index, size=int(len(df) * 0.02), replace=False)  # 2% time gaps
    for idx in missing_time_indices:
        next_time_idx = idx + randint(1, 3)  # Skip 1-3 time periods
        if next_time_idx < len(df):
            df.loc[next_time_idx, 'Date'] = 'Missing'  # Simulate missing time period

    return df

# Replenishment function with corrected logic
def replenish_atm(atm_balance, last_replenishment, current_time, initial_balance, replenish_threshold):

    # Convert string date to datetime object if necessary
    if isinstance(last_replenishment, str):
        last_replenishment = datetime.strptime(last_replenishment, '%Y-%m-%d')
    
    # Calculate the time difference in hours
    time_diff = current_time - last_replenishment
    
    # Check if balance is below threshold and 4 hours have passed (only replenish then)
    if atm_balance < replenish_threshold and time_diff.total_seconds() >= 4 * 3600:
        atm_balance = initial_balance  # Replenish the ATM to its initial balance
        last_replenishment = current_time  # Update last replenishment time
        print(f"Replenishing ATM at {current_time}. New balance: {atm_balance}")
    
    return atm_balance, last_replenishment


def generate_synthetic_data():
    allData = []

    # Loop through each ATM and generate hourly data
    for atm_id in ATM:  # Assuming 20 ATMs for this example
        data = []
        current_time = datetime(2021, 1, 1, 0, 0)  # Start at Jan 1, 2022
        end_date = datetime(2024, 11, 11, 23, 59)  # End at Nov 10, 2024
        last_replenishment = current_time - timedelta(days=randint(1, 7))  # Last replenishment within the last 7 days
        initial_balance = 150000  # Starting cash balance of the ATM
        atm_balance = initial_balance  # Set initial ATM balance
        replenish_threshold = 0.1 * initial_balance  # 10% of the initial ATM balance

        # Generate data for each hour until end date
        while current_time <= end_date:
            # Determine the trend for withdrawals based on the location type and time
            weekday = current_time.weekday()
            day_name = calendar.day_name[weekday]
            ATM_info = ATM[atm_id]
            location_type = ATM_info['location_type']
            trend = ATM_info['days_of_week'].get(day_name)

            # Determine peak and non-peak hours based on the location type and day of the week
            peak_hours = trend['peak']
            non_peak_hours = trend['non_peak']

            # Tighter standard deviations for predictability
            peak_withdrawals_mean = 12  
            peak_withdrawals_std = 1    # Reduced variability
            non_peak_withdrawals_mean = 5  
            non_peak_withdrawals_std = 0.5  # Further reduced variability

            # Fixed range for withdrawal amounts
            peak_withdrawal_amount_range = (180, 220)  # Predictable range for peak hours
            non_peak_withdrawal_amount_range = (90, 110)  # Predictable range for non-peak hours

            # Determine the number of withdrawals and average amount based on time
            if any(start <= current_time.hour < end for start, end in peak_hours):
                num_withdrawals = int(max(1, np.random.normal(peak_withdrawals_mean, peak_withdrawals_std)))
                num_withdrawals = min(num_withdrawals, 20)  # Ensure num_withdrawals doesn't exceed 20
                avg_withdrawal_amount = np.random.uniform(*peak_withdrawal_amount_range)  # Within a set range
            elif any(start <= current_time.hour < end for start, end in non_peak_hours):
                num_withdrawals = int(max(1, np.random.normal(non_peak_withdrawals_mean, non_peak_withdrawals_std)))
                num_withdrawals = min(num_withdrawals, 20)  # Ensure num_withdrawals doesn't exceed 20
                avg_withdrawal_amount = np.random.uniform(*non_peak_withdrawal_amount_range)  # Within a set range

            # Apply a predictable 20% increase for public holidays
            if is_public_holiday(current_time):
                num_withdrawals += int(0.20 * num_withdrawals)
                num_withdrawals = min(num_withdrawals, 20)  # Ensure num_withdrawals doesn't exceed 20
                avg_withdrawal_amount += 20  # Add 20 directly instead of scaling

            # Calculate the total withdrawals based on num_withdrawals and avg_withdrawal_amount
            total_withdrawals = round(avg_withdrawal_amount * num_withdrawals)

            # Ensure the ATM cash level does not drop below zero and cap the withdrawal
            max_withdrawal_limit = 10000  # Max withdrawal in a single hour, adjust as needed
            if total_withdrawals > max_withdrawal_limit:
                total_withdrawals = max_withdrawal_limit  # Cap to max withdrawal limit

            # If total withdrawals exceed the available balance, cap it at the available balance
            if atm_balance - total_withdrawals < 0:
                total_withdrawals = atm_balance  # Cap the withdrawal to the available cash

            atm_balance -= total_withdrawals  # Reduce ATM balance

            # Add the day of the week before the date
            day_of_week = current_time.strftime('%A')

            # Collect the data for this hour
            data.append({
                'ATM_ID': atm_id,
                'Location_Type': location_type,  # New column for ATM location type
                # 'Day_Of_Week': day_of_week,  # New column for the day of the week
                'DateTime': current_time,
                # 'Date': current_time.date(),
                # 'Time': current_time.strftime('%H:%M'),
                'Total_Withdrawals': total_withdrawals,  # Total amount withdrawn
                'Num_Withdrawals': num_withdrawals,  # Number of withdrawals made in that hour
                'ATM_Cash_Level': atm_balance, # round((atm_balance/initial_balance) * 100),  # Percentage of cash remaining
                'Cash_Level_Drop': round((initial_balance - atm_balance) / initial_balance * 100),  # Amount of cash withdrawn
                # '1hr_Cash_Level_Lag': data[-1]['ATM_Cash_Level'] if len(data) >= 1 else None,  # 1-hour cash lag
                # '3hr_Cash_Level_Lag': data[-3]['ATM_Cash_Level'] if len(data) >= 3 else None,  # 3-hour cash lag
                # '6hr_Cash_Level_Lag': data[-6]['ATM_Cash_Level'] if len(data) >= 6 else None,  # 6-hour cash lag
                'isHoliday': is_public_holiday(current_time),  # New column for public holiday
            })

            # Check if ATM needs replenishment
            atm_balance, last_replenishment = replenish_atm(atm_balance, last_replenishment, current_time, initial_balance, replenish_threshold)

            # Move to the next hour
            current_time += timedelta(hours=1)
        
        # Append the data for this ATM to the main list
        allData.extend(data)
        atm_data = pd.DataFrame(data)
        # atm_data = check_out_of_cash_within_24h(pd.DataFrame(data))
        atm_data.to_csv('atm_id' + str(atm_id) + ".csv", index=False)

    # Convert the collected data into a pandas DataFrame
    df = pd.DataFrame(data)
    
    return df


# Function to check if the current time is one week before a special event
# def is_pre_special_event(current_time):
#     # Example special events: Chinese New Year (Feb 10-11, 2024), Hari Raya Pusa (Apr 9-10, 2024)
#     special_events = [
#         {'event': 'Chinese New Year', 'start': datetime(2024, 2, 10), 'end': datetime(2024, 2, 11)},
#         {'event': 'Hari Raya Pusa', 'start': datetime(2024, 4, 9), 'end': datetime(2024, 4, 10)}
#     ]
    
#     # Check if the current time is within one week before a special event
#     for event in special_events:
#         one_week_before_event = event['start'] - timedelta(weeks=1)
#         if one_week_before_event <= current_time < event['start']:
#             return 1  # One week before the special event
#     return 0  # No pre-special event within one week


# Function to check if the ATM will run out of cash in the next 24 hours
def check_out_of_cash_within_24h(df):
    for idx in range(len(df)):
        current_row = df.iloc[idx]
        atm_balance = current_row['ATM_Cash_Level']
        current_time = current_row['DateTime']
        replenish_threshold = 0.1 * 150000  # Assuming 10% of the initial ATM balance
        
        # Check future 24 hours based on subsequent rows
        out_of_cash = 0
        for future_idx in range(idx + 1, min(idx + 25, len(df))):  # Check next 24 hours (or till end of data)
            future_row = df.iloc[future_idx]
            future_balance = future_row['ATM_Cash_Level']
            if future_balance < replenish_threshold:  # If future balance goes below threshold
                out_of_cash = 1
                break
        
        # Update the 'Out_Of_Cash_Within_24H' column
        df.at[idx, 'Out_Of_Cash_Within_24H'] = out_of_cash
    
    return df

# Generate the data and print a small sample
df = generate_synthetic_data()

def plot_hourly_withdrawals(df):
    # Convert DateTime to pandas datetime if it's not already
    df['DateTime'] = pd.to_datetime(df['DateTime'])
    
    # Filter data for the first 30 days
    start_date = df['DateTime'].min()
    end_date = start_date + pd.Timedelta(days=30)
    df_filtered = df[(df['DateTime'] >= start_date) & (df['DateTime'] < end_date)]
    
    # Group by ATM_ID and resample data to hourly total withdrawals
    df_filtered['Hour'] = df_filtered['DateTime'].dt.hour  # Extract hour for each row
    df_filtered['Date'] = df_filtered['DateTime'].dt.date  # Extract date for each row
    
    # Calculate total withdrawals for each hour
    hourly_withdrawals = df_filtered.groupby(['ATM_ID', 'Date', 'Hour'])['Total_Withdrawals'].sum().reset_index()
    
    # Plot hourly total withdrawals for each ATM
    plt.figure(figsize=(12, 6))
    for atm_id in df_filtered['ATM_ID'].unique():
        atm_data = hourly_withdrawals[hourly_withdrawals['ATM_ID'] == atm_id]
        for date in atm_data['Date'].unique():
            daily_data = atm_data[atm_data['Date'] == date]
            plt.plot(daily_data['Hour'], daily_data['Total_Withdrawals'], label=f'ATM {atm_id} on {date}')
    
    plt.title("Hourly Total Withdrawals for the First 30 Days")
    plt.xlabel("Hour of Day")
    plt.ylabel("Total Withdrawals")
    plt.legend(title="ATM ID & Date", bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.xticks(range(0, 24))
    plt.tight_layout()
    plt.show()

# Call the function to plot
plot_hourly_withdrawals(df)

# Check if ATM will run out of cash within 24 hours
# df = check_out_of_cash_within_24h(df)

df.to_csv('synthetic_atm_data_with_no_noise.csv', index=False)
print(df.head())
