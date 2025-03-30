import React, { createContext, useContext, useState } from "react";

type SearchContextType = {
    searchKeyword: string;
    setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
    muscleGroup: string;
    setMuscleGroup: React.Dispatch<React.SetStateAction<string>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode}) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <SearchContext.Provider
            value={{
                searchKeyword,
                setSearchKeyword,
                muscleGroup,
                setMuscleGroup,
                currentPage,
                setCurrentPage,
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}