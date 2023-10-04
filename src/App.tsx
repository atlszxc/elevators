import { useMemo, useState } from "react"
import Elevator, { DIRECTION } from "./components/Elevator"
import { ElevatorsConf } from "./consts/config"
import FloorBtns, { FLOOR_STATUS, IFloorButton } from "./components/FloorBtns"
import History from "./components/History"

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

export enum ELEVATOR_STATUS {
  FREE,
  BUSY,
  REST,
}

export interface IElevatorHistory {
  floorNumber: number,
  elevavatorNumber: number,
  steps: number,
  direction: DIRECTION,
  time: Date
}

function App() {
  const [floorBtns, setFloorBtn] = useState([...Array<IFloorButton>(ElevatorsConf.floorCount)].map((_, id) => ({ id, status: FLOOR_STATUS.FREE })))
  const [elevatorsHistory, setElevatorsHistory] = useState<IElevatorHistory[]>([])

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
          const totalSteps = item.callsStack.reduce((acc, item) => acc + item.steps, 0)

          if(Math.abs(totalSteps - floorNumber) < acc.steps) {
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
    <div>
      <section className={`grid ${elevatorList.length > 6? 'grid-cols-1' : 'grid-cols-2'}  gap-4 p-4`}>
          <div className={`grid grid-flow-col auto-cols-max gap-4 `}>
            {
              elevatorList.map((elevator, id) => <Elevator elevator={elevator} changeElevator={setElevators} updateHistory={setElevatorsHistory} changeFloorStatus={setFloorBtn} key={id} />)
            }
            <FloorBtns floorBtns={floorBtns} callElevator={callElevator} />
          </div>
          <div>
            <History records={elevatorsHistory} />
          </div>
      </section>
    </div>
  )
}

export default App
