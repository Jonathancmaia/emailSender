import { ReactNode, useState } from 'react';

interface AccordionProps {
    title: string;
    children: ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {

    const [accordionState, setAccordioState] = useState(true);

    const expandOrCollapseArccordionBody = () => {
        setAccordioState(!accordionState);
    }

    return (
        <div className="p-6 text-gray-900 dark:text-gray-100">  
            <h1 className="mb-5 flex items-center place-content-between cursor-pointer" onClick={()=>{expandOrCollapseArccordionBody()}}>
                {title}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-caret-down duration-500 ${accordionState ? 'rotate-180' : ''}`} viewBox="0 0 16 16">
                    <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                </svg>
            </h1>
            <div className={`${accordionState ? 'hidden' : ''}`}>
                {children}
            </div>
        </div>
    );
};