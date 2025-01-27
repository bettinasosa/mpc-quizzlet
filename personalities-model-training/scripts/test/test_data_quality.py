import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def test_data_quality(train_path='data/train_data.csv', test_path='data/test_data.csv'):
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    print("=== Data Quality Checks ===")
    print(f"Train samples: {len(train_df)}, Test samples: {len(test_df)}")

    # Check distribution of personalities
    print("\nTrain distribution:")
    print(train_df['personality_type'].value_counts())
    print("\nTest distribution:")
    print(test_df['personality_type'].value_counts())

    # Check correlations among features in train set
    corr = train_df.corr(numeric_only=True)
    plt.figure(figsize=(10,8))
    sns.heatmap(corr, annot=True, cmap='coolwarm')
    plt.title("Correlation Heatmap (Train Data)")
    plt.savefig("data/correlation_heatmap.png")
    plt.close()
    print("Saved correlation_heatmap.png")

if __name__ == "__main__":
    test_data_quality()
