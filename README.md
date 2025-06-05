# 📊 Linear Regression Visualizer (React.js)

An interactive web-based visualization tool to explore **Simple Linear**, **Multiple Linear**, and **Polynomial Regression** with synthetic datasets. Built using React.js, Recharts, and Tailwind CSS.

![screenshot](./preview.png)

## 🚀 Features

- 📈 Visualize different types of regression:
  - Simple Linear Regression (1 predictor)
  - Multiple Linear Regression (4 predictors)
  - Polynomial Regression (non-linear, degree 3)
- 🧮 Built-in regression equation display and R² value
- 📉 Interactive charts powered by `recharts`
- 📂 Export dataset as CSV
- 💻 Python implementation snippets included for each regression type
- 🔍 Key insights dynamically generated

---

## 🧰 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Charts**: Recharts
- **Data Generation**: Procedurally generated datasets (synthetic)
- **Export**: CSV file download via Blob API

---

## 📦 Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (v14+)
- npm or yarn
- Git (optional, if cloning via terminal)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/linear-regression-visualizer.git
cd linear-regression-visualizer

# Install dependencies
npm install

# Run the development server
npm start
