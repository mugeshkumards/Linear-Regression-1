import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const LinearRegression = () => {
  const [selectedExample, setSelectedExample] = useState('simple');
  const [showResults, setShowResults] = useState(false);

  // Generate datasets
  const generateSimpleData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const x = i * 2 + Math.random() * 10;
      const y = 2.5 * x + 10 + Math.random() * 20 - 10; // y = 2.5x + 10 + noise
      data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    return data;
  };

  const generateMultipleData = () => {
    const data = [];
    for (let i = 0; i < 100; i++) {
      const size = 500 + Math.random() * 2500; // House size (500-3000 sq ft)
      const bedrooms = Math.floor(Math.random() * 5) + 1; // 1-5 bedrooms
      const age = Math.random() * 50; // 0-50 years old
      const location = Math.random() > 0.5 ? 1 : 0; // Good location (1) or not (0)
      
      // Price = 50*size + 5000*bedrooms - 200*age + 20000*location + noise
      const price = 50 * size + 5000 * bedrooms - 200 * age + 20000 * location + 
                   (Math.random() * 20000 - 10000);
      
      data.push({
        size: parseFloat(size.toFixed(0)),
        bedrooms,
        age: parseFloat(age.toFixed(1)),
        location,
        price: parseFloat(price.toFixed(0))
      });
    }
    return data;
  };

  const generatePolynomialData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const x = (i - 25) / 5; // x from -5 to 5
      const y = 0.5 * x * x * x - 2 * x * x + x + 5 + Math.random() * 4 - 2;
      data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    return data;
  };

  const [simpleData] = useState(generateSimpleData());
  const [multipleData] = useState(generateMultipleData());
  const [polynomialData] = useState(generatePolynomialData());

  // Simple Linear Regression calculations
  const calculateSimpleRegression = (data) => {
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const meanY = sumY / n;
    const totalSumSquares = data.reduce((sum, point) => sum + Math.pow(point.y - meanY, 2), 0);
    const residualSumSquares = data.reduce((sum, point) => {
      const predicted = slope * point.x + intercept;
      return sum + Math.pow(point.y - predicted, 2);
    }, 0);
    const rSquared = 1 - (residualSumSquares / totalSumSquares);

    return { slope, intercept, rSquared };
  };

  const simpleRegression = calculateSimpleRegression(simpleData);

  // Generate regression line for plotting
  const generateRegressionLine = (data, slope, intercept) => {
    const minX = Math.min(...data.map(d => d.x));
    const maxX = Math.max(...data.map(d => d.x));
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  };

  const regressionLine = generateRegressionLine(simpleData, simpleRegression.slope, simpleRegression.intercept);

  const dataExamples = {
    simple: {
      title: "Simple Linear Regression",
      description: "Single predictor variable (x) predicting outcome (y)",
      data: simpleData,
      equation: `y = ${simpleRegression.slope.toFixed(2)}x + ${simpleRegression.intercept.toFixed(2)}`,
      rSquared: simpleRegression.rSquared.toFixed(3)
    },
    multiple: {
      title: "Multiple Linear Regression",
      description: "Multiple predictors: House Size, Bedrooms, Age, Location → Price",
      data: multipleData.slice(0, 10), // Show first 10 rows
      equation: "Price = β₀ + β₁(Size) + β₂(Bedrooms) + β₃(Age) + β₄(Location)",
      features: ["Size (sq ft)", "Bedrooms", "Age", "Location", "Price ($)"]
    },
    polynomial: {
      title: "Polynomial Regression",
      description: "Non-linear relationship using polynomial features",
      data: polynomialData,
      equation: "y = β₀ + β₁x + β₂x² + β₃x³"
    }
  };

  const currentExample = dataExamples[selectedExample];

  const downloadCSV = (data, filename) => {
    let csv = '';
    if (selectedExample === 'simple' || selectedExample === 'polynomial') {
      csv = 'x,y\n';
      csv += data.map(row => `${row.x},${row.y}`).join('\n');
    } else {
      csv = 'size,bedrooms,age,location,price\n';
      csv += data.map(row => `${row.size},${row.bedrooms},${row.age},${row.location},${row.price}`).join('\n');
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Linear Regression: Simple to Advanced
      </h1>

      {/* Example Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(dataExamples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedExample === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current Example Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">{currentExample.title}</h2>
        <p className="text-blue-700 mb-2">{currentExample.description}</p>
        <p className="font-mono text-sm bg-white p-2 rounded border">
          <strong>Equation:</strong> {currentExample.equation}
        </p>
        {selectedExample === 'simple' && (
          <p className="mt-2 text-blue-700">
            <strong>R-squared:</strong> {currentExample.rSquared} (explains {(parseFloat(currentExample.rSquared) * 100).toFixed(1)}% of variance)
          </p>
        )}
      </div>

      {/* Visualization */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Data Visualization</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={400}>
            {selectedExample === 'simple' ? (
              <ScatterChart data={simpleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" name="X" />
                <YAxis dataKey="y" name="Y" />
                <Tooltip formatter={(value, name) => [value.toFixed(2), name]} />
                <Scatter name="Data Points" fill="#8884d8" />
                <Line 
                  data={regressionLine} 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name="Regression Line"
                  dot={false}
                />
              </ScatterChart>
            ) : selectedExample === 'polynomial' ? (
              <ScatterChart data={polynomialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" name="X" />
                <YAxis dataKey="y" name="Y" />
                <Tooltip formatter={(value, name) => [value.toFixed(2), name]} />
                <Scatter name="Non-linear Data" fill="#82ca9d" />
              </ScatterChart>
            ) : (
              <ScatterChart data={multipleData.slice(0, 30)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" name="Size (sq ft)" />
                <YAxis dataKey="price" name="Price ($)" />
                <Tooltip 
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value, 
                    name
                  ]} 
                />
                <Scatter name="Houses" fill="#8884d8" />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Sample Data</h3>
          <button
            onClick={() => downloadCSV(
              selectedExample === 'multiple' ? multipleData : currentExample.data,
              `${selectedExample}_regression_data.csv`
            )}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Download CSV
          </button>
        </div>
        
        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {selectedExample === 'multiple' ? (
                  currentExample.features.map((feature, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      {feature}
                    </th>
                  ))
                ) : (
                  <>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">X</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Y</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentExample.data.slice(0, 10).map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {selectedExample === 'multiple' ? (
                    <>
                      <td className="px-4 py-2 text-sm">{row.size}</td>
                      <td className="px-4 py-2 text-sm">{row.bedrooms}</td>
                      <td className="px-4 py-2 text-sm">{row.age}</td>
                      <td className="px-4 py-2 text-sm">{row.location ? 'Good' : 'Average'}</td>
                      <td className="px-4 py-2 text-sm">${row.price.toLocaleString()}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-sm">{row.x}</td>
                      <td className="px-4 py-2 text-sm">{row.y}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 text-xs text-gray-500 bg-gray-50">
            Showing first 10 rows of {selectedExample === 'multiple' ? multipleData.length : currentExample.data.length} total records
          </div>
        </div>
      </div>

      {/* Python Implementation */}
      <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-lg font-semibold mb-3 text-white">Python Implementation</h3>
        <pre className="overflow-x-auto">
{selectedExample === 'simple' ? `
# Simple Linear Regression
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Load data (X should be 2D for sklearn)
X = data[['x']]  # or X = data['x'].values.reshape(-1, 1)
y = data['y']

# Create and fit model
model = LinearRegression()
model.fit(X, y)

# Get predictions
y_pred = model.predict(X)

# Results
print(f"Slope: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"R-squared: {r2_score(y, y_pred):.3f}")

# Plot
plt.scatter(X, y, alpha=0.6)
plt.plot(X, y_pred, color='red', linewidth=2)
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Simple Linear Regression')
plt.show()
` : selectedExample === 'multiple' ? `
# Multiple Linear Regression
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Prepare features
X = data[['size', 'bedrooms', 'age', 'location']]
y = data['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and fit model
model = LinearRegression()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Results
print("Coefficients:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"  {feature}: {coef:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"R-squared: {r2_score(y_test, y_pred):.3f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
` : `
# Polynomial Regression
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

# Create polynomial features (degree=3)
poly_model = Pipeline([
    ('poly', PolynomialFeatures(degree=3)),
    ('linear', LinearRegression())
])

X = data[['x']]
y = data['y']

# Fit model
poly_model.fit(X, y)

# Predictions
y_pred = poly_model.predict(X)

# For plotting smooth curve
X_plot = np.linspace(X.min(), X.max(), 100).reshape(-1, 1)
y_plot = poly_model.predict(X_plot)

# Plot
plt.scatter(X, y, alpha=0.6)
plt.plot(X_plot, y_plot, color='red', linewidth=2)
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Polynomial Regression (degree=3)')
plt.show()
`}
        </pre>
      </div>

      {/* Key Insights */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">Key Insights</h3>
        <ul className="list-disc list-inside text-yellow-700 space-y-1">
          {selectedExample === 'simple' && (
            <>
              <li>Simple linear regression finds the best straight line through data points</li>
              <li>R-squared of {currentExample.rSquared} means the model explains {(parseFloat(currentExample.rSquared) * 100).toFixed(1)}% of the variance</li>
              <li>Each unit increase in X is associated with a {simpleRegression.slope.toFixed(2)} unit change in Y</li>
            </>
          )}
          {selectedExample === 'multiple' && (
            <>
              <li>Multiple regression considers several factors simultaneously</li>
              <li>Each coefficient shows the effect of that variable while holding others constant</li>
              <li>More complex but can capture real-world relationships better</li>
            </>
          )}
          {selectedExample === 'polynomial' && (
            <>
              <li>Polynomial regression can capture non-linear relationships</li>
              <li>Uses powers of X (x², x³) as additional features</li>
              <li>Be careful of overfitting with high degree polynomials</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LinearRegression;