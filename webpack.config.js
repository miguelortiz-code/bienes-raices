import path from 'path';

export default{
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        addImage: './src/js/agregar-imagen.js',
        mostrarMapa: './src/js/showMaps.js',
        mapsHome: './src/js/mapsHome.js',
        changeState: '/src/js/changeState.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}