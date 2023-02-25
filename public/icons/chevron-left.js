import React from 'react'

export default function ChevronLeftSVG({fill='#21201f', stroke="#21201f"}) {
    return (
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4L7 12L15 20" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}