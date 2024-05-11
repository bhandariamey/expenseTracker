import { useState, useEffect, useRef } from 'react'

import styles from './Home.module.css'
import Card from '../Card/Card.jsx'
import ReactModal from 'react-modal';
import ExpenseModal from '../AddExpenseModal/AddExpense.jsx'

import {v4 as uuidv4} from 'uuid'
import { BsFillFuelPumpFill } from "react-icons/bs";
import { MdFoodBank } from "react-icons/md";
import { MdOutlineLocalHospital } from "react-icons/md";
import { GiFilmProjector } from "react-icons/gi";
import { FaMoneyCheck } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { useSnackbar } from 'notistack'

import { Chart } from "react-google-charts";


export default function Home(){

    const [balanceAmount, setBalanceAmount] = useState(5000)
    const [expenseAmount, setExpenseAmount] = useState(0)
    const [expenseDets, setExpenseDets] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(3)

    let pageNumber = useRef(1)

    const totals = {
        entertainment: useRef(0),
        food: useRef(0),
        fuel: useRef(0),
        other: useRef(0),
        medical: useRef(0)
      };
 
    function compare(a,b){
        if(a.price > b.price){
            return -1
        }
        if(a<b){
            return 1
        }
        return 0
    }

    

    const calculateIndividualCategoryTotal = () => {

        const obj = JSON.parse(localStorage.getItem("ExpensesList"))

        const entObj = obj.filter((item)=>{return item.category === "Entertainment"})
        const foodObj = obj.filter((item)=>{return item.category === "Food"})
        const fuelObj = obj.filter((item)=>{return item.category === "Fuel"})
        const medicalObj = obj.filter((item)=>{return item.category === "Medical"})
        const othersObj = obj.filter((item)=>{return item.category === "Others"})

        totals.entertainment.current = 0
        for(let i=0; i<entObj.length;i++){
            totals.entertainment.current += entObj[i].price
            
        }

        localStorage.setItem("Ent", JSON.stringify(totals.entertainment.current))

        totals.food.current = 0
        for(let i=0; i<foodObj.length;i++){
            totals.food.current += foodObj[i].price 
            

        }

        localStorage.setItem("Food", totals.food.current)

        totals.fuel.current = 0
        for(let i=0; i<fuelObj.length;i++){
            totals.fuel.current += fuelObj[i].price 
           

        }

        localStorage.setItem("Fuel", totals.fuel.current)

        totals.medical.current = 0
        for(let i=0; i<medicalObj.length;i++){
            totals.medical.current += medicalObj[i].price 
            
            
        }
        localStorage.setItem("Med", totals.medical.current)

        totals.other.current = 0
        for(let i=0; i<othersObj.length;i++){
            totals.other.current += othersObj[i].price 
        }
        localStorage.setItem("Other", totals.other.current)

    }

    const addEntry = (title, price, date, category,uniqueId) => {

        const newEntry = { title, price, date,category,uniqueId };
        const difference = balanceAmount-price
        const addedExpense = expenseAmount + price

        if(difference >= 0){
            setExpenseDets([...expenseDets, newEntry])
            setBalanceAmount(difference)
            setExpenseAmount(expenseAmount + price)
            
            // setMessage("Expense added")
            enqueueSnackbar('Expense added', { autoHideDuration: 1500, variant:'success' })
            const storedList = localStorage.getItem("ExpensesList")
            let storedListParsing = JSON.parse(storedList)
            storedListParsing.push(newEntry)
            const newListInString = JSON.stringify(storedListParsing.sort(compare))
            

            localStorage.setItem("ExpensesList",newListInString)

            localStorage.setItem("BalanceAmount", difference)
            localStorage.setItem("ExpenseAmount", addedExpense)

            calculateIndividualCategoryTotal()
            // calculateTopThree()

        }
        else{
            enqueueSnackbar('Insufficient Balance! Cannot add Expense', { autoHideDuration: 1500, variant:'error' })
            }
        
    }


    const handleAddBalance = (e)=>{
        e.preventDefault()
        const ele = document.getElementById("userEnteredAmount")
        const userValue = parseInt(ele.value)
        setBalanceAmount(balanceAmount+userValue)   
        // setMessage("Amount Added successfully")
        enqueueSnackbar("Amount Added Successfully", {variant:'success', autoHideDuration:2000})
        localStorage.setItem("BalanceAmount",balanceAmount+userValue)
        e.target.reset()
    }   

    const updateExpense = (diff, editedExpense, updatedExpensesDets) => {
        setBalanceAmount(balanceAmount+diff)
        setExpenseAmount(expenseAmount-diff)
        setExpenseDets(updatedExpensesDets)
        updatedExpensesDets[editIndex] = editedExpense
       
        // setMessage("Expense Edited Successfully")
        enqueueSnackbar("Expense Edited Successfully", {variant:'success', autoHideDuration:2000})

        localStorage.setItem("BalanceAmount", balanceAmount+diff)
        localStorage.setItem("ExpenseAmount", expenseAmount-diff)
        localStorage.setItem("ExpensesList", JSON.stringify(updatedExpensesDets.sort(compare)))
        calculateIndividualCategoryTotal()
        // calculateTopThree()

    }

    const handleSubmit = (e)=>{

        e.preventDefault();
        const title = e.target.title.value
        const price = parseInt(e.target.price.value)
        const date = new Date(e.target.date.value).toLocaleDateString()
        const category = e.target.category.value
        const uniqueId = uuidv4()

        if(editIndex !== null){

            const editedExpense = {title, price,date,category,uniqueId}
            const updatedExpensesDets = [...expenseDets]
            const oldPrice = updatedExpensesDets[editIndex].price
            
            const diff = oldPrice-price

            if(diff<0){
                if(balanceAmount + diff < 0){
                    enqueueSnackbar("Cannot edit since the Expense is going above balance", {variant:'error', autoHideDuration:1500})
                }
                else{
                    updateExpense(diff, editedExpense, updatedExpensesDets)
                }
            }
            else{
                updateExpense(diff, editedExpense, updatedExpensesDets)
            }

            setEditIndex(null)
        }

        else
            {
                addEntry(title, price,date,category, uniqueId)
            }

        e.target.reset()
    }

    const handleCloseModal = ()=>{
        setShowModal(false)
    }

    
    const handleDelete = (uniqueId) => {

        const datacopy = [...expenseDets]
        const element = datacopy.find((elem)=>{return elem.uniqueId === uniqueId})
        const amountToBeRemoved = element.price
        
        setExpenseAmount(expenseAmount-amountToBeRemoved)
        setBalanceAmount(balanceAmount+amountToBeRemoved)
        
        const filteredData = datacopy.filter((elem)=>{return elem.uniqueId !== uniqueId})
        setExpenseDets(filteredData)
        
        localStorage.setItem("BalanceAmount", balanceAmount+amountToBeRemoved)
        localStorage.setItem("ExpenseAmount", expenseAmount-amountToBeRemoved)
        localStorage.setItem("ExpensesList",JSON.stringify(filteredData.sort(compare)))
        calculateIndividualCategoryTotal()
        // calculateTopThree()

        const fetchedUpdatedData = JSON.parse(localStorage.getItem("ExpensesList"))
        if(fetchedUpdatedData.slice(start,end).length === 0 && start > 0){
            pageNumber.current -=1
            setStart(start-3)
            setEnd(end-3)

        }
        
        enqueueSnackbar("Data Deleted Successfully!", {variant:'success', autoHideDuration:1500})
    }
    
    const handlePrevious = () => {
        if(start-3 < 0){
            enqueueSnackbar("Reached Start", {variant:'error', autoHideDuration:1500})
        }
        else{
            pageNumber.current-=1
            setStart(start-3)
            setEnd(end-3)
            
        }
    }

    const handleNext = () => {
        if(expenseDets[end] === undefined){
            enqueueSnackbar("Reached End", {variant:'error', autoHideDuration:1500})
        }
        else{
            pageNumber.current += 1
            setStart(start+3)
            setEnd(end+3)
            
        }
    }

    

    
    useEffect(() => {
        const storedBalanceAmount = parseInt(localStorage.getItem("BalanceAmount"));
        const storedExpenseAMount = parseInt(localStorage.getItem("ExpenseAmount"));
        const storedList = JSON.parse(localStorage.getItem("ExpensesList"));
        
        if (storedBalanceAmount>=0 || (expenseAmount<=5000 && storedList)) {
            setBalanceAmount(Number(storedBalanceAmount)); 
            setExpenseAmount(Number(storedExpenseAMount))
            setExpenseDets(storedList)
            totals.entertainment.current = parseInt(localStorage.getItem("Ent"))

        }else{
            localStorage.setItem("BalanceAmount",balanceAmount)
            localStorage.setItem("ExpensesList", JSON.stringify(expenseDets.sort(compare)))
            // calculateTopThree()
            localStorage.setItem("ExpenseAmount", expenseAmount)
        }


    },[]);


    return (
        <div>
            <div className={styles.upperWrapper}>
                <h2 className={styles.heading}>Expense Tracker</h2>
                <div className={styles.wrapper}>
                    <Card color={"#39AD48"} text={"Wallet Balance"} amount={balanceAmount} buttonText={"Add Income"} handleAddBalance={handleAddBalance}/>
                    <Card color={"#FF4500"} text={"Expenses"} amount={expenseAmount} buttonText={"Add Expense"}addEntry={addEntry} expenseDets={expenseDets} handleSubmit={handleSubmit}/>
                    {/* <div style={{width:"200px"}}>
                        {expenseDets.length>0 && 
                            <PieChart
                                data={[
                                    { title: 'Entertainment', value: parseInt(localStorage.getItem("Ent")), color: 'violet' },
                                    { title: 'Food', value: parseInt(localStorage.getItem("Food")), color: 'brown' },
                                    { title: 'Fuel', value: parseInt(localStorage.getItem("Fuel")), color: 'yellow' },
                                    { title: 'Medical', value:parseInt(localStorage.getItem("Med")), color: 'cyan' },
                                    { title: 'Others', value: parseInt(localStorage.getItem("Other")), color: 'green' },
                                ]}

                                label={({ x, y, dx, dy, dataEntry }) => (
                                    <text
                                    x={x}
                                    y={y}
                                    dx={dx}
                                    dy={dy}
                                    dominant-baseline="central"
                                    text-anchor="middle"
                                    style={{
                                        fontSize: '6px',
                                        fontFamily: 'sans-serif',
                                    }}
                                    >
                                    {Math.round(dataEntry.percentage)!==0 && Math.round(dataEntry.percentage) + "%"}
                                    </text>
                                )}
                            />
                        }
                    </div> */}

                    <Chart
                        chartType="PieChart"
                        data={[
                            ["Category", "ExpenseTotal"],
                            [ 'Entertainment', parseInt(localStorage.getItem("Ent"))],
                            [ 'Food', parseInt(localStorage.getItem("Food"))],
                            [ 'Fuel', parseInt(localStorage.getItem("Fuel"))],
                            [ 'Medical', parseInt(localStorage.getItem("Med"))],
                            [ 'Others', parseInt(localStorage.getItem("Other"))],
                                
                        ]}

                        options={{
                            backgroundColor: 'none',
                        }}
                    />
                </div>
            </div>

            {
                <ReactModal isOpen={showModal} style={{content:{background:'lightgrey',width:'fit-content',height:'fit-content', position:'absolute', top: '50%', left:'50%', transform:'translateX(-50%) translateY(-50%)'}}}>
                    <ExpenseModal handleSubmit={handleSubmit} handleCloseModal={handleCloseModal}/>
                </ReactModal>
            
            }

{                expenseDets[0] && <h2 style={{fontStyle:'italic'}} className={styles.heading}>Recent Transactions</h2>
}                {expenseDets[0] &&
                <div className={styles.lowerWrapper}> 
                
                <ul className={styles.ul}>
                    {expenseDets.slice(start,end).map((item, index) => (
                       <div className={styles.expenseWrapper} key={index}> 
                            <div className={styles.left}>
                                <div className={styles.icon}>
                                   { item.category === "Entertainment" ? <GiFilmProjector style={{fontSize:'20px'}}></GiFilmProjector> :
                                     item.category === "Fuel" ? <BsFillFuelPumpFill style={{fontSize:'20px'}}></BsFillFuelPumpFill> :
                                     item.category === "Food" ? <MdFoodBank style={{fontSize:'20px'}}></MdFoodBank> :
                                     item.category === "Medical" ? <MdOutlineLocalHospital style={{fontSize:'20px'}}></MdOutlineLocalHospital> :
                                     <FaMoneyCheck style={{fontSize:'20px'}}></FaMoneyCheck>
                                    }
                                </div>
                                <div className={styles.nameAndDate}>
                                    <p className={styles.title}>{item.title}</p>
                                    <p className={styles.date}> {item.date}</p>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <p className={styles.amount}>₹{item.price}</p>
                                    <button className={styles.delete} onClick={()=>{handleDelete(item.uniqueId)}}><MdDeleteOutline style={{fontSize:'20px'}}></MdDeleteOutline></button>
                                    <button className={styles.edit} onClick={()=>{setShowModal(true); setEditIndex(index+start)}}><MdEdit style={{fontSize:'20px'}}></MdEdit></button>
                            </div>
                            
                       </div>
                    ))}
                    <div className={styles.pagination}>
                        <button id='previous' onClick={handlePrevious}><FaAngleLeft></FaAngleLeft></button>
                        <span className={styles.pageNumber}>{pageNumber.current}</span>
                        <button id='next' onClick={handleNext}><FaAngleRight></FaAngleRight></button>
                    </div>
                </ul>

                <Chart
                    chartType="BarChart"
                    style={{ width: '50vw', padding: '10px', borderRadius:'10px', height:'max-content'}} 
                    data={
                        [
                            ["Category", "Expenses"],
                            [ 'Entertainment', parseInt(localStorage.getItem("Ent"))],
                            [ 'Food', parseInt(localStorage.getItem("Food"))],
                            [ 'Fuel', parseInt(localStorage.getItem("Fuel"))],
                            [ 'Medical', parseInt(localStorage.getItem("Med"))],
                            [ 'Others', parseInt(localStorage.getItem("Other"))],
                        ]
                    }
                />
            </div>
        }
           
           
        </div>
    )
}