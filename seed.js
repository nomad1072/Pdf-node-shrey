var path = require('path');
const data = [
    ['Siddharth', '21', 'Bangalore'],
    ['Vaibhav', '21', 'Mumbai'],
    ['Suraj', '21', 'Mumbai'],
    ['Shrey', '21', 'Udaipur']
];
const headers = [
    {text: "Name"},
    {text: "Age"},
    {text: "Place"}
];

const body = [headers, ...data]

var docDefinition = {
    content: [
        {
            layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                widths: ['*', 'auto', '*'],
                body: body
            }
        }
    ]
};

const fontRoot = path.resolve(__dirname, 'fonts');

 const fonts = {
    Roboto: {
        normal: path.join(fontRoot, "Roboto-Regular.ttf"),
        bold: path.resolve(fontRoot, "Roboto-Medium.ttf"),
        italics: path.resolve(fontRoot, "Roboto-Italic.ttf"),
        bolditalics: path.resolve(fontRoot, "Roboto-Italic.ttf")
    }
}

module.exports = {
    data,
    docDefinition,
    fonts
}