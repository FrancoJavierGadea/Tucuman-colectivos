

export function transformText(string = ''){

    const text = string.replaceAll('-', ' ');

    return {
        text,
        capitalize: text.at(0).toUpperCase() + text.slice(1)
    }
}