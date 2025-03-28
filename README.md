# SplitSavvy

SplitSavvy is a powerful yet intuitive tool designed to streamline the dataset preparation process for machine learning tasks and data science competitions. With just a few clicks, users can upload CSV files, configure training/testing splits, and generate properly formatted datasets ready for model training or hosting Kaggle competitions.


## Features

- **CSV File Upload**: Easily upload your dataset with drag-and-drop functionality.
- **Automatic Data Analysis**: View column names, data types, encoding, and dataset dimensions.
- **Flexible Dataset Splitting**:
  - Configure test/train splits with customizable ratios
  - Set public/private leaderboard partitions
  - Support for binary and multi-class classification
- **File Generation**:
  - Training dataset (`train.csv`)
  - Testing dataset (`test.csv`)
  - Evaluation file with public/private designations (`evaluation.csv`)
  - Sample submission templates (`sample_submission.csv`)
- **Kaggle-Ready Output**: Generate files that conform to Kaggle competition standards

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/make_file.git
# cd make_file

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python -m src.main
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. **Upload Your Dataset**:
   - Drag and drop your CSV file or click to select
   - View automatic analysis of your dataset

2. **Configure Split Parameters**:
   - Select target column
   - Adjust test size (10-50%)
   - Set public leaderboard percentage
   - For binary classification:
     - Enable binary classification toggle
     - Set positive and negative labels
     - Optionally set replacement label for other values

3. **Generate Files**:
   - Click "Generate Files"
   - Review dataset statistics

4. **Download Generated Files**:
   - Download train.csv, test.csv, evaluation.csv, and sample_submission.csv

## Tech Stack

- **Backend**:
  - FastAPI
  - pandas
  - scikit-learn
  - numpy

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contributors

<a href="https://github.com/adhi1911">
  <img src="https://github.com/adhi1911.png" width="50" height="50" alt="adhi1911"/>
</a>
<a href="https://github.com/Sanchit-Joshi">
  <img src="https://github.com/Sanchit-Joshi.png" width="50" height="50" alt="janesmith"/>
</a>


Created with ❤️ for the data science community

