import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const MainButton = (props: any) => {
    return (
        <motion.a
            href={props.href}
            className="
            leading-[1.3] py-[9px] px-[12px] mt-4 text-[20px] inline-block text-primary border-[#313338] border-solid border-[1px] 
            bg-[#1a1c21] rounded-[10px] hover:bg-[#38373d] hover:border-[#4b4b4b] hover:transition-all hover:duration-200 hover:ease-out
            "
            whileTap={{ scale: 0.95 }}
        >
            <span className="font-metropolis font-normal leading-4">{props.text}</span>
        </motion.a>
    );
};
