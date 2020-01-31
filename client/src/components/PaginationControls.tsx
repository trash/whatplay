import React from 'react';

export type PaginationControlsProps = {
    currentPage: number;
    resultsMaxPage: number;
    updatePage: (delta: number) => void;
};

export class PaginationHelpers {
    static updatePage(
        searchText: string,
        currentPage: number,
        delta: number,
        setCurrentPage: (nextPage: number) => void,
        runSearch: (searchText: string, nextPage: number) => void
    ) {
        let nextPage = currentPage + delta;
        if (nextPage < 0) {
            nextPage = 0;
        }
        if (nextPage === currentPage) {
            return;
        }
        setCurrentPage(nextPage);
        runSearch(searchText, nextPage);
    }
}

export const PaginationControls: React.FC<PaginationControlsProps> = props => {
    return (
        <div className="paginationControls">
            <button
                disabled={props.currentPage === 0}
                onClick={() => props.updatePage(-1)}
            >
                Previous
            </button>
            <div>
                Page {props.currentPage + 1} of {props.resultsMaxPage + 1}
            </div>
            <button
                disabled={props.currentPage === props.resultsMaxPage}
                onClick={() => props.updatePage(+1)}
            >
                Next
            </button>
        </div>
    );
};
