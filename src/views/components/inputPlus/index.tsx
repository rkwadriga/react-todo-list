import React, { useState, useCallback } from "react";

import styles from './index.module.scss';

interface InputPlusProps {
    onAdd: (title: string) => void;
}

export const InputPlus: React.FC<InputPlusProps> = ({onAdd}) => {
    const [inputValue, setInputValue] = useState('');
    const addTask = useCallback(() => {
        onAdd(inputValue);
        setInputValue('');
    }, [inputValue]);

    return (
        <div className={styles.inputPlus}>
            <input
                type="text"
                className={styles.inputPlusValue}
                value={inputValue}
                placeholder="Task name"
                onChange={event => {
                    setInputValue(event.target.value);
                }}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        addTask();
                    }
                }}
            />
            <button
                aria-label="Add"
                className={styles.inputPlusButton}
                onClick={addTask}
            />
        </div>
    );
};