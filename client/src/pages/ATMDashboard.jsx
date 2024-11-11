import React from 'react';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import ReplenishmentTable from '../components/ReplenishmentTable';
import styles from '../styles/ATMDashboard.module.css';

const ATM = {
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


// Convert ATM object to array with keys (ATM IDs)
const atmArrayWithIds = Object.entries(ATM).map(([atmId, data]) => ({ atmId, ...data }));

const ATMDashboard = () => {
  return (
    <div className={styles.appContainer}>
      <header className="header">
        <h1>ATM Management Dashboard</h1>
      </header>

      <div className={styles.visualizationsContainer}>
        {/* ATM Replenishment Prioritization */}
        <div className={styles.visualizationCard}>
          <h2>ATM Replenishment Prioritization</h2>
          <ReplenishmentTable data={atmArrayWithIds}/>
        </div>

        {/* ATM Cash Balance Trends */}
        <div className={styles.visualizationCard}>
          <h2>ATM Cash Balance Trends</h2>
          <LineChart />
        </div>

        {/* Withdrawal Volume by ATM */}
        <div className={styles.visualizationCard}>
          <h2>Withdrawal Volume by ATM</h2>
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default ATMDashboard;
