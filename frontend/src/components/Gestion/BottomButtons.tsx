'use client';
import { Button, Stack } from '@carbon/react';


interface ButtonConfig {
  text: string;
  kind: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  onClick?: () => void;
}

interface BottomButtonsProps {
  gap?: number;
  buttons: ButtonConfig[];
}

export default function BottomButtons({ gap = 4, buttons }: BottomButtonsProps) {
  return (
    <Stack
      orientation="horizontal"
      gap={gap}
      style={{
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
      }}
    >
      {buttons.map((btn, index) => (
        <Button key={index} kind={btn.kind} onClick={btn.onClick}>
          {btn.text}
        </Button>
      ))}
    </Stack>
  );
}



