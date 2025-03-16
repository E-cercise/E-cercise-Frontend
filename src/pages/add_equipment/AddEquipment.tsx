import NavBar from "../../components/navbar/NavBar.tsx";
import HeaderRow from "../../components/HeaderRow/HeaderRow.tsx";
import {useAuth} from "../../hook/UseAuth.tsx";

function AddEquipmentPage(){
    const {role} = useAuth()

    return <div className="h-full pt-3 pb-3 pl-5 pr-5">
    <NavBar />
        <HeaderRow role={role} title={"Add Equipment"}/>
        <div className="flex flex-col items-center justify-center w-full h-[84.5vh] bg-[#D9D9D9] rounded-md space-y-2">

            hello
        </div>
    </div>
};


export default AddEquipmentPage;