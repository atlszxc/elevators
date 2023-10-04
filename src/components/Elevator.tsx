import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ElevatorsConf } from "../consts/config"
import { ELEVATOR_STATUS, IElevator, IElevatorHistory } from "../App"
import { FLOOR_STATUS, IFloorButton } from "./FloorBtns"

export enum DIRECTION {
    UP = 'up',
    DOWN = 'down',
  }

type ElevatorProp = {
    elevator: IElevator,
    changeFloorStatus: Dispatch<SetStateAction<IFloorButton[]>>,
    changeElevator: Dispatch<SetStateAction<IElevator[]>>,
    updateHistory: Dispatch<SetStateAction<IElevatorHistory[]>>,
}

enum DELAIES {
    MOVE_DELAY = 1000,
    REST_DELAY = 3000,
}

const Elevator = ({ elevator, changeFloorStatus, changeElevator, updateHistory }: ElevatorProp) => {
    const [floors] = useState([...Array(ElevatorsConf.floorCount)].map((_, id) => id))
    const [isCalling, setIsCalling] = useState<boolean>(false)

    const delay = (time: DELAIES) => new Promise((resolve) => setTimeout(resolve, time))
    
    const changeStatus = (status: ELEVATOR_STATUS) => {
        elevator.status = status
        changeElevator(prev => {
            prev[elevator.id] = elevator
            return [...prev]
        })
    }

    

    const move = async (steps: number, direction: DIRECTION, floorNumber: number) => {
        changeStatus(ELEVATOR_STATUS.BUSY)

        const historySteps = steps

        while(steps > 0) {
            await delay(DELAIES.MOVE_DELAY).then(() => {
                direction === DIRECTION.UP? elevator.currentPosition++ : elevator.currentPosition--
                changeElevator(prev => {
                    prev[elevator.id] = elevator
                    return [...prev]
                })
            })

            steps--
        }

        changeStatus(ELEVATOR_STATUS.REST)

        updateHistory(prev => prev.concat({ 
            floorNumber, 
            direction, 
            elevavatorNumber: elevator.id, 
            steps: historySteps,
            time: new Date(Date.now()) 
        }))

        await delay(DELAIES.REST_DELAY).then(() => changeStatus(ELEVATOR_STATUS.FREE))

        changeFloorStatus(prev => {
            prev[floorNumber].status = FLOOR_STATUS.FREE
            return [...prev]
        })

    }

    useEffect(() => {
        if(elevator.callsStack.length && !isCalling) {
            setIsCalling(true)

            const data = elevator.callsStack[0]

            if(data) {
                move(data.steps, data.direction, data.floorNumber).then(() => {
                    elevator.callsStack.shift()
                    changeElevator(prev => {
                        prev[elevator.id] = elevator
                        return [...prev]
                    })
                    setIsCalling(false)
                })
            }
        }
    })

    return (
        <div className="flex flex-col-reverse max-w-fit">
            {
                floors.map((floor, id) => (
                    <div
                        key={id}
                        className={`w-[100px] h-[150px] border-solid border-2 duration-150 border-black ${id === elevator.currentPosition && `${elevator.status === ELEVATOR_STATUS.FREE? 'bg-green-400': elevator.status === ELEVATOR_STATUS.BUSY? 'bg-red-400' : 'bg-yellow-400'}`}`}
                    >   
                        {
                            elevator.status === ELEVATOR_STATUS.BUSY && id === elevator.currentPosition && 
                            <div className="text-white">
                                <span>{ elevator.callsStack[0].floorNumber + 1 }</span>
                                {
                                    elevator.callsStack[0].direction === DIRECTION.UP ? 
                                        <span>&uarr;</span> 
                                        : 
                                        <span>&darr;</span>
                                }
                            </div>
                        }
                        <span>{floor + 1}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default Elevator