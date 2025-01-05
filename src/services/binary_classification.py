import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
import os
import src.globals as globals

GENERATED_FILES_DIRECTORY = "generated_files"
os.makedirs(GENERATED_FILES_DIRECTORY, exist_ok=True)

def split_and_generate_files(uploaded_df, target_column, test_size,public_leaderboard):
    # global uploaded_df, target_column, test_size , public_leaderboard
    if uploaded_df is None or target_column is None or test_size is None:
        raise ValueError("Data, target column, or test size not set")

    # Split the data into train and test sets
    X = uploaded_df.drop(columns=[target_column])
    y = uploaded_df[target_column]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    # Add ID column to both train and test
    X_train['ID'] = range(1, len(X_train) + 1)
    X_test['ID'] = range(1, len(X_test) + 1)

    # Combine X and y for train and test
    train_df = X_train.copy()
    train_df[target_column] = y_train.values
    test_df = X_test.copy()
    # test_df[target_column] = y_test.values

    # Create evaluation file
    evaluation_df = test_df[['ID']]
    evaluation_df['Usage'] = np.random.choice(['Public', 'Private'], size=len(test_df), p=[public_leaderboard, 1-public_leaderboard])
    evaluation_df[target_column] = y_test.values

    evaluation_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'evaluation.csv'), index=False)

    # Create sample submission file
    sample_submission_df = test_df[['ID']].copy()
    sample_submission_df[target_column] = np.random.randint(0, 2, size=len(test_df))
    sample_submission_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'sample_submission.csv'), index=False)

    # Save train and test files
    train_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'train.csv'), index=False)
    test_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'test.csv'), index=False)

def split_and_generate_binary_classification_files(uploaded_df, target_column, test_size,public_leaderboard, positive_label, negative_label, replace_label=None):
    # global uploaded_df, target_column, test_size
    if uploaded_df is None or target_column is None or test_size is None:
        raise ValueError("Data, target column, or test size not set")

    # Handle more than 2 unique values in the target column
    unique_values = uploaded_df[target_column].unique()
    if len(unique_values) > 2:
        if replace_label is None:
            raise ValueError("More than 2 unique values in the target column. Please provide a replace label.")
        uploaded_df[target_column] = uploaded_df[target_column].apply(lambda x: replace_label if x != positive_label and x != negative_label else x)

    # Split the data into train and test sets
    X = uploaded_df.drop(columns=[target_column])
    y = uploaded_df[target_column]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    # Add ID column to both train and test
    X_train['ID'] = range(1, len(X_train) + 1)
    X_test['ID'] = range(1, len(X_test) + 1)

    # Combine X and y for train and test
    train_df = X_train.copy()
    train_df[target_column] = y_train.values
    test_df = X_test.copy()
    # test_df[target_column] = y_test.values

    # Create evaluation file
    evaluation_df = test_df[['ID']]
    evaluation_df['Usage'] = np.random.choice(['Public', 'Private'], size=len(test_df), p=[public_leaderboard, 1-public_leaderboard])
    evaluation_df[target_column] = y_test.values
    evaluation_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'evaluation.csv'), index=False)

    # Create sample submission file
    sample_submission_df = test_df[['ID']].copy()
    sample_submission_df[target_column] = np.random.choice([positive_label, negative_label], size=len(test_df))
    sample_submission_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'sample_submission.csv'), index=False)

    # Save train and test files
    train_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'train.csv'), index=False)
    test_df.to_csv(os.path.join(GENERATED_FILES_DIRECTORY, 'test.csv'), index=False)