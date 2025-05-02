
import { useFrame } from "@react-three/fiber";

import React, { useEffect, useRef, useState, useMemo } from "react";


import * as THREE from "three";
import { useChat } from "../hooks/useChat";


const SYMBOLS = {
    HEART: "heart",
    STAR: "star",
    EXCLAMATION: "exclamation",
    LIGHT_BULB: "lightBulb",
    SMILE: "smile"
};

export function PopUp(props) {
    const group = useRef();

    const { message, onMessagePlayed, chat } = useChat();

    // Generische State für Popup-Effekte
    const [popupEffect, setPopupEffect] = useState({
        show: false,
        symbolType: null,
        position: [0, 3, -15],
        count: Math.floor(Math.random() * 3) + 3
    });

    // Funktion zum Auslösen von Popup-Effekten
    const triggerPopupEffect = (symbolType, position = [0, 8, -35], count = Math.floor(Math.random() * 3) + 3) => {
        setPopupEffect({
            show: true,
            symbolType,
            position,
            count
        });

        // Effekt nach kurzem Moment zurücksetzen (der Effekt selbst bleibt noch sichtbar)
        setTimeout(() => {
            setPopupEffect(prev => ({ ...prev, show: false }));
        }, 100);
    };

    useEffect(() => {
        if (!message) {
            return;
        }

        const object = message.object;

        console.log("object", object);
        if (object === "heart") {
            triggerPopupEffect(SYMBOLS.HEART);
        }
        else if (object === "star") {
            triggerPopupEffect(SYMBOLS.STAR, undefined, Math.floor(Math.random() * (15 - 7 + 1)) + 7);
        }
        else if (object === "exclamation mark") {
            triggerPopupEffect(SYMBOLS.EXCLAMATION);
        }
        else if (object === "lightbulb") {
            triggerPopupEffect(SYMBOLS.LIGHT_BULB);
        }
        else if (object === "smile") {
            triggerPopupEffect(SYMBOLS.SMILE);
        }
    }, [message]);

    return (
        <group {...props} dispose={null} ref={group}>
            {/* Generischer Popup-Effekt */}
            <PopupEffect
                symbolType={popupEffect.symbolType}
                trigger={popupEffect.show}
                position={popupEffect.position}
                count={popupEffect.count}
            />
        </group>
    );
}


// Generische Funktion zum Erstellen der Symbole
function createSymbolShape(symbolType) {
    const shape = new THREE.Shape();

    switch (symbolType) {
        case SYMBOLS.HEART:
            // Herz
            shape.moveTo(0, 0);
            shape.bezierCurveTo(0, -0.5, -1, -1, -2, 0);
            shape.bezierCurveTo(-3, 1, -3, 2, 0, 3.5);
            shape.bezierCurveTo(3, 2, 3, 1, 2, 0);
            shape.bezierCurveTo(1, -1, 0, -0.5, 0, 0);
            return { shape, color: 0xff69b4 }; // Pink

        case SYMBOLS.STAR:
            // Stern
            const points = 5;
            const outerRadius = 1;
            const innerRadius = 0.4;
            const angleStep = Math.PI / points;

            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = i * angleStep;
                const x = Math.sin(angle) * radius;
                const y = Math.cos(angle) * radius;

                if (i === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            }
            shape.closePath();
            return { shape, color: 0xffff00 }; // Gelb


        case SYMBOLS.EXCLAMATION:
            // Ausrufezeichen
            shape.moveTo(-0.2, 0);
            shape.lineTo(0.2, 0);
            shape.lineTo(0.5, -3);
            shape.lineTo(-0.5, -3);
            shape.closePath();

            // Punkt unter dem Ausrufezeichen
            const dot = new THREE.Shape();
            dot.moveTo(0, 0);
            dot.arc(0, 1.5, 0.4, 0, Math.PI * 2, false);
            dot.closePath();

            return { shape, color: 0xff0000, additionalShapes: [dot] }; // Rot


        case SYMBOLS.LIGHT_BULB:
            // Glühbirne
            shape.moveTo(0, 0);
            shape.arc(0, 0, 1, 0, Math.PI * 2, false);
            shape.moveTo(-0.5, -1);
            shape.lineTo(-0.5, -2);
            shape.lineTo(0.5, -2);
            shape.lineTo(0.5, -1);
            shape.closePath();

            const dotL = new THREE.Shape();
            dotL.moveTo(-0.25, -1);
            dotL.lineTo(-0.25, 0);
            dotL.lineTo(0.25, 0);
            dotL.lineTo(0.25, -1);
            dotL.lineTo(-0.25, -1);
            dotL.closePath();

            return { shape, color: 0xffcc00, additionalShapes: [dotL], additionalColor: 0x888888 }; // Gelb

        case SYMBOLS.SMILE:
            // Smiley
            shape.moveTo(0, 0);
            shape.arc(0, 0, 2, 0, Math.PI * 2, false);
            shape.closePath();

            // Augen
            const leftEye = new THREE.Shape();
            leftEye.moveTo(0, 0);
            leftEye.arc(-0.6, -0.6, 0.3, 0, Math.PI * 2, false);
            leftEye.closePath();

            const rightEye = new THREE.Shape();
            rightEye.moveTo(0, 0);
            rightEye.arc(0.6, -0.6, 0.3, 0, Math.PI * 2, false);
            rightEye.closePath();

            // Mund
            const mouth = new THREE.Shape();
            mouth.moveTo(-1, 0.5);
            mouth.bezierCurveTo(-1, 1.5, 1, 1.5, 1, 0.5);
            mouth.closePath();

            return {
                shape,
                color: 0xffff00,
                additionalShapes: [leftEye, rightEye, mouth],
                additionalColor: 0x000000 // Schwarz für Augen und Mund 
            };

        default:
            // Fallback: einfacher Kreis
            shape.moveTo(0, 0);
            shape.arc(0, 0, 1, 0, Math.PI * 2, false);
            return { shape, color: 0x00ff00 }; // Grün
    }
}

// Generische Symbol-Komponente
function SymbolMesh({ symbolType, position, rotation, scale }) {
    const { shape, color, additionalShapes = [], additionalColor } = createSymbolShape(symbolType);

    return (
        <group position={position} rotation={rotation} scale={scale || 0.2}>
            <mesh>
                <shapeGeometry args={[shape]} />
                <meshBasicMaterial
                    color={color}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={1}
                />
            </mesh>

            {/* Zusätzliche Formen rendern (für komplexe Symbole) */}
            {additionalShapes.map((additionalShape, index) => (
                <mesh key={index} renderOrder={1}>
                    <shapeGeometry args={[additionalShape]} />
                    <meshBasicMaterial
                        color={additionalColor !== undefined ? additionalColor : color}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={1}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Generische PopupEffect-Komponente
function PopupEffect({ symbolType, trigger, position, count = 5 }) {
    const [effects, setEffects] = useState([]);
    const groupRef = useRef();

    // Beim Auslösen eines Triggers neue Effekte hinzufügen
    useEffect(() => {
        if (trigger) {
            const newEffects = [];
            const effectCount = count || Math.floor(Math.random() * 3) + 3; // 3 bis 5 Symbole

            for (let i = 0; i < effectCount; i++) {
                const randomX = (Math.random() - 0.5) * (5 + Math.random() * 3);
                const randomY = (Math.random() - 0.5) * (1 + Math.random() * 2);
                const delay = Math.random() * 500;

                const effect = {
                    id: Date.now() + Math.random(),
                    position: [position[0] + randomX, position[1] + randomY, position[2]],
                    scale: 0.2 + Math.random() * 0.1,
                    rotation: [0, 0, (Math.random() - 0.5) * 0.5],
                    opacity: 1
                };

                // Jeder Effekt bekommt sein eigenes Delay
                setTimeout(() => {
                    setEffects(prev => [...prev, effect]);

                    // Nach 3 Sekunden wieder entfernen
                    setTimeout(() => {
                        setEffects(prev => prev.filter(e => e.id !== effect.id));
                    }, 3000);
                }, delay);
            }
        }
    }, [trigger, position, count]);

    // Animation der Effekte
    useFrame(() => {
        if (groupRef.current && effects.length > 0) {
            // Update effects state with new positions and opacities
            setEffects(prev => prev.map(effect => {
                return {
                    ...effect,
                    position: [effect.position[0], effect.position[1] + 0.01, effect.position[2]],
                    opacity: Math.max(0, effect.opacity - 0.005)
                };
            }));
        }
    });

    return (
        <group ref={groupRef}>
            {effects.map((effect) => (
                <SymbolMesh
                    key={effect.id}
                    symbolType={symbolType}
                    position={effect.position}
                    rotation={[effect.rotation[0], effect.rotation[1], effect.rotation[2] + Math.PI]}
                    scale={effect.scale}
                />
            ))}
        </group>
    );
}