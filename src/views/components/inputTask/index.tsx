import React, { useState, useRef, useEffect } from "react";

import styles from './index.module.scss';

interface InputTaskProps {
    id: string;
    title: string;
    onDone: (id: string) => void;
    onEdited: (id: string, title: string) => void;
    onRemoved: (id: string) => void;
}

export const InputTask: React.FC<InputTaskProps> = ({
    id,
    title,
    onDone,
    onEdited,
    onRemoved
}) => {
    const [checked, setChecked] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [value, setValue] = useState(title);
    const editTitleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditMode) {
            editTitleInputRef?.current?.focus();
        }
    }, [isEditMode]);

    return (
        <div className={styles.inputTask}>
            <label className={styles.inputTaskLabel}>
                <input
                    type="checkbox"
                    className={styles.inputTaskCheckbox}
                    checked={checked}
                    disabled={isEditMode}
                    onChange={event => {
                        setChecked(event.target.checked);
                        if (event.target.checked) {
                            setTimeout(() => onDone(id), 500);
                        }
                    }}
                />
                { isEditMode ? (
                    <input
                        type="text"
                        className={styles.inputTaskTitleEdit}
                        value={value}
                        ref={editTitleInputRef}
                        onChange={event => setValue(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                onEdited(id, value);
                                setIsEditMode(false);
                            }
                        }}
                    />
                ) : (
                    <h3 className={styles.inputTaskTitle}>{title}</h3>
                )}
            </label>
            {isEditMode ? (
                <button
                    aria-label="Save"
                    className={styles.inputTaskSaveBtn}
                    onClick={() => {
                        onEdited(id, value);
                        setIsEditMode(false);
                    }}
                />
            ) : (
                <button
                    aria-label="Edit"
                    className={styles.inputTaskEditBtn}
                    onClick={() => {
                        setIsEditMode(true);
                    }}
                />
            )}
            <button
                aria-label="Remove"
                className={styles.inputTaskRemoveBtn}
                onClick={() => {
                    if (confirm('Are you sure?')) {
                        onRemoved(id);
                    }
                }}
            />
        </div>
    );
};