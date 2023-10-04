import { FLOOR_STATUS, IFloorButton } from "../App"

type FloorBtnsProps = {
    floorBtns: IFloorButton[],
    callElevator: (floorNumber: number) => void
}

const FloorBtns = ({ floorBtns, callElevator }: FloorBtnsProps) => {
    return (
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
    )
}

export default FloorBtns