import { useMemo, useState } from "react"
import Elevator, { DIRECTION } from "./components/Elevator"
import { ElevatorsConf } from "./consts/config"

interface ICallParams {
  steps: number,
  direction: DIRECTION,
  floorNumber: number,
}

export interface IElevator {
  id: number,
  currentPosition: number,
  status: ELEVATOR_STATUS,
  callsStack: Array<ICallParams>
}

export interface IFloorButton {
  id: number,
  status: FLOOR_STATUS
}

export enum FLOOR_STATUS {
  CALLING,
  FREE
}

export enum ELEVATOR_STATUS {
  FREE,
  BUSY,
  REST,
}

function App() {
  const [floorBtns, setFloorBtn] = useState([...Array<IFloorButton>(ElevatorsConf.floorCount)].map((_, id) => ({ id, status: FLOOR_STATUS.FREE })))
  const [elevators, setElevators] = useState(
      [...Array<IElevator>(ElevatorsConf.elevatorsCount)].map((_, id) => ({ 
        id,
        currentPosition: 0,
        status: ELEVATOR_STATUS.FREE,
        callsStack: Array<ICallParams>()
      })
    )
  )

  const elevatorList = useMemo(() => elevators, [elevators])

  const callElevator = async (floorNumber: number) => {
    const { idx, steps, direction } = elevators.reduce((acc, item) =>  {
      if(item.status === ELEVATOR_STATUS.FREE || item.status === ELEVATOR_STATUS.REST) {
        if(Math.abs(floorNumber - item.currentPosition) < acc.steps ) {
          acc = {
            idx: item.id,
            steps: Math.abs(floorNumber - item.currentPosition),
            direction: item.currentPosition < floorNumber? DIRECTION.UP : DIRECTION.DOWN
          }
        }
      } else {
        if(item.status === ELEVATOR_STATUS.BUSY) {
          if(Math.abs(item.callsStack[item.callsStack.length - 1].floorNumber - floorNumber) < acc.steps) {
            acc = {
              idx: item.id,
              steps: Math.abs(item.callsStack[item.callsStack.length - 1].floorNumber - floorNumber),
              direction: item.callsStack[item.callsStack.length - 1].floorNumber < floorNumber? DIRECTION.UP : DIRECTION.DOWN
            }
          }
        }
      } 

      return acc
    }, { idx: 0, steps: ElevatorsConf.floorCount, direction: DIRECTION.UP })


    elevators[idx].callsStack.push({ steps, direction, floorNumber })
    setElevators([...elevators])

    floorBtns[floorNumber].status = FLOOR_STATUS.CALLING
    setFloorBtn([...floorBtns])
  } 

  return (
    <div className="p-4 flex">
      {
        elevatorList.map((elevator, id) => <Elevator elevator={elevator} changeElevator={setElevators} changeFloorStatus={setFloorBtn} key={id} />)
      }
      <div className="flex flex-col-reverse">
        {
          floorBtns.map(btn => (
            <div key={btn.id} className="h-[150px] w-[50px] flex items-center justify-center">
              <button 
                onClick={() => btn.status === FLOOR_STATUS.FREE && callElevator(btn.id)}
                className={`p-4 border-solid border-2 border-black duration-150 ${btn.status === FLOOR_STATUS.CALLING && 'bg-red-400 text-white'}`}
              >
                { btn.id + 1 }
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
