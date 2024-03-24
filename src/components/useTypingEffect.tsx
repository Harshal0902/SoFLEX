"use client"

import { useEffect, useState } from 'react'

enum Phase {
    Typing,
    Pausing,
    Deleting,
}

const typingInterval = 80
const typingPause = 1500
const deletingInterval = 50

export const useTypingEffect = (myService: string[]): { typedMyService: string, selectedMyService: string } => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [typedMyService, setTypedMyService] = useState('');
    const [phase, setPhase] = useState(Phase.Typing);

    useEffect(() => {
        switch (phase) {
            case Phase.Typing:
                {
                    const nextTypedMyService = myService[selectedIndex].slice(
                        0,
                        typedMyService.length + 1
                    )

                    if (nextTypedMyService === typedMyService) {
                        setPhase(Phase.Pausing)
                        return
                    }

                    const timeout = setTimeout(() => {
                        setTypedMyService(nextTypedMyService)
                    }, typingInterval)

                    return () => clearTimeout(timeout)
                }
            case Phase.Deleting:
                {
                    if (!typedMyService) {
                        const nextIndex = selectedIndex + 1
                        setSelectedIndex(myService[nextIndex] ? nextIndex : 0)
                        setPhase(Phase.Typing)
                        return
                    }

                    const nextRemaining = myService[selectedIndex].slice(
                        0,
                        typedMyService.length - 1
                    )

                    const timeout = setTimeout(() => {
                        setTypedMyService(nextRemaining)
                    }, deletingInterval)

                    return () => clearTimeout(timeout)
                }
            case Phase.Pausing:
            default:
                const timeout = setTimeout(() => {
                    setPhase(Phase.Deleting)
                }, typingPause)

                return () => clearTimeout(timeout)
        }

    }, [myService, typedMyService, phase, selectedIndex])

    return { typedMyService, selectedMyService: myService[selectedIndex] }
}
