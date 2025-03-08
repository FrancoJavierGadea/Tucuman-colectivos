

export function transformText(string = ''){

    const text = string.replaceAll('-', ' ');

    return {
        text,
        capitalize: text.at(0).toUpperCase() + text.slice(1)
    }
}

const github = 'https://github.com/FrancoJavierGadea/Tucuman-colectivos';

export const URL_UTILS = {

    github: {
        raw: (path, {repository = github} = {}) => {

            return [
                'https://raw.githubusercontent.com',
                new URL(repository).pathname,
                '/refs/heads/main',
                path
            ].join('');
        }
    },

    geojsonIo: {

        data: (url) => {

            return `https://geojson.io/#data=data:text/x-url,${encodeURIComponent(url)}`;
        }
    }
}

