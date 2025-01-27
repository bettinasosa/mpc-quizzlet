# Personality Test Application

A modern web application for conducting personality assessments built with Next.js 14, TypeScript, and the shadcn/ui component library. The application uses a custom-trained machine learning model for personality analysis.

## Features

- Interactive personality quiz interface
- Real-time progress tracking
- Dynamic results visualization
- Personality type cards with detailed descriptions
- Integration with Partisia Blockchain for secure data handling
- Custom-trained ML model for personality prediction

## Tech Stack

### Frontend

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Blockchain Integration**: Partisia Blockchain

### Model Training

- **Language**: Python
- **ML Libraries**: scikit-learn, pandas, numpy
- **Data Processing**: JSON for model export/import

## Project Structure

```
├── app/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Logo.tsx
│   ├── QuizPage.tsx
│   ├── Results.tsx
│   └── TestModel.tsx
├── personalities-model-training/
│   ├── data/
│   │   └── model.json
│   ├── notebooks/
│   └── scripts/
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git
- Python 3.8+ (for model training)
- pip (Python package manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/personality-test-app.git
cd personality-test-app
```

2. Install frontend dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Python environment (for model training):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r personalities-model-training/requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
```

## Usage

### Running the Web Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Training the Model

1. Navigate to the model training directory:

```bash
cd personalities-model-training
```

2. Run the training script:

```bash
python scripts/train_model.py
```

3. The trained model will be exported to `data/model.json`

## Model Training

The personality prediction model is trained using Python and machine learning techniques. The training process includes:

1. Data preprocessing and feature engineering
2. Model selection and hyperparameter tuning
3. Model evaluation and validation
4. Export of the trained model to JSON format for frontend integration

The model is designed to predict personality traits based on user responses to the quiz questions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Partisia Blockchain](https://partisiablockchain.com)
- [scikit-learn](https://scikit-learn.org/) for machine learning capabilities
