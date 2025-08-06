import { Dimensions } from 'react-native';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export const wp = (per: number) => {
    return (per * WIDTH) / 100;
};

export const hp = (per: number) => {
    return (per * HEIGHT) / 100;
};

export const COLORS = {
    primary: '#FAF8F5',
    white: '#fff',
    lightWhite: '#EBEBEB80',
    brown: '#6B4226',
    blue: '#284CFF',
    lightBlue: '#284CFF1A',
    lightgray: '#A09CAB',
    blueAccent: '#448AFF',// blue accent
    black: '#000',
    gray: '#9e9e9e',
    green: '#22C55E',
    red: '#F04438',
    orange: '#F97316',
    purple: '#8B5CF6',
    lightGreen: '#22C55E1A',
    lightOrange: '#F973161A',
    lightPurple: '#8B5CF61A',
    lightRed: '#F044381A',
};

export const FONT = {
    black: 'Inter-Black',
    bold: 'Inter-Bold',
    extraBold: 'Inter-ExtraBold',
    extraLight: 'Inter-ExtraLight',
    light: 'Inter-Light',
    medium: 'Inter-Medium',
    regular: 'Inter-Regular',
    semiBold: 'Inter-SemiBold',
    thin: 'Inter-Thin',
}