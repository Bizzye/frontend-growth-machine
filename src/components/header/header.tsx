
import { signOut } from "next-auth/react";
import { IoLogOutOutline } from "react-icons/io5";
import { Button } from "../ui/button";

export function Header() {
    function deslogar() {
        signOut();
    }

    return (
        <header className="bg-slate-950 flex justify-center items-center py-5 relative">
        <h1 className="text-4xl font-bold">Userz Growth</h1>
        <div className="absolute right-12">
            <Button variant='default' onClick={deslogar}>
                <IoLogOutOutline  size={30}/>
                <span className="ml-2">
                    logout
                </span>
            </Button>
        </div>
        </header>
    )
}