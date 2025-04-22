import { rem, Text } from "@mantine/core";
import { Trophy } from "./Trophy";

export function NumberedTrophy({num, color}: {num: number, color?: string}) {
    return (
        <div style={{position: "relative", marginTop: rem(5)}}>
            <Trophy style={{ width: rem(35), height: rem(35), color }} />
            <Text style={{
                position: "absolute",
                zIndex: 1, 
                left: 13, 
                top: 3, 
                fontSize: rem(15), 
                fontWeight: "bold", 
                color
            }}>
                {num}
            </Text>
        </div>
    )
}