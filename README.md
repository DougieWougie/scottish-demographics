# Scottish Demographics Visualization

A modern, interactive dashboard visualizing demographic data for Scotland, built with React, Tailwind CSS, and Recharts.

![Dashboard Screenshot](https://github.com/DougieWougie/scottish-demographics/raw/main/screenshot.png)

## Features

- **Interactive Dashboard**: Visualize key demographic metrics at a glance.
- **Dynamic Charts**: Explore population distribution by age and ethnicity.
- **Dark Mode**: Fully supported dark theme with persistent preference.
- **Real Data**: Powered by official data from National Records of Scotland (NRS) and Scotland's Census 2022.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Data Sources

This application uses real demographic data sourced from:
- **National Records of Scotland (NRS)**: Mid-2022 Population Estimates.
- **Scotland's Census 2022**: Ethnicity data (Figure 5).

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Processing**: Node.js, XLSX

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/DougieWougie/scottish-demographics.git
    cd scottish-demographics
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### Fetching Fresh Data

To re-fetch and process the latest data from the official sources:
```bash
npm run fetch-data
```
*(Note: Requires `scripts/fetch-data.js` to be configured with valid URLs)*

## License

This project is open source and available under the [MIT License](LICENSE).
