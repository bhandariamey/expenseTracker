import styles from './AddExpense.module.css'
export default function ExpenseCard(props){
    const {handleSubmit, handleCloseModal} = props
    return(
        <>
            <div className={styles.modal}>
                <h3 className={styles.header}>Add Expenses</h3>
                <div className={styles.amountWrapper}>

                <form onSubmit={handleSubmit}>
                    <div className={styles.gridContainer}>
                        <input className={styles.gridItem} type="text" id="title" placeholder='Title' required />
                        <input className={styles.gridItem} type="number" id="price" min={0} placeholder='Price' required />
                        
                        <select className={styles.gridItem} id="category" required>
                            <option selected disabled>Choose Category</option>
                            <option value="Food">Food</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Medical">Medical</option>
                            <option value="Fuel">Fuel</option>
                            <option value="Others">others</option>
                        </select>
                        <input className={styles.gridItem} type="date" id="date" placeholder='dd/mm/yyyy' required />
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.addExpense} style={{marginRight:'10px'}} type='submit'>Add Expense</button>
                        <button className={styles.addExpense} style={{backgroundColor:'grey'}} onClick={handleCloseModal}>Cancel</button>      
                    </div>
                </form>
                </div>
            </div>
        </>
    )
}