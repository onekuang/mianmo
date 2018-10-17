export default class LastMayday {
  palette() {
    return ({
      width: '654rpx',
      height: '1000rpx',
      background: '#eee',
      views: [
        _kuang(0),
        {
          type: 'image',
          content: 'http://bjm.smilehehe.com/uploadFiles/uploadImgs/haibao.jpg',
          css: {
            top: '0rpx',
            left: '0rpx',
            right:'0rpx',
            bottom:'0rpx',
            color: 'red',
            width: '720px',
            height: '667px',
          },
        },
      ],
    });
  }
}

const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '40rpx',
};

function _textDecoration(decoration, index, color) {
  return ({
    type: 'text',
    text: decoration,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      color: color,
      textDecoration: decoration,
    }, common],
  });
}

function _image(index, rotate, borderRadius) {
  return (
    {
      type: 'image',
      url: 'http://bjm.smilehehe.com/uploadFiles/uploadImgs/haibao.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        rotate: rotate,
        borderRadius: borderRadius,
      },
    }
  );
}
function _kuang() {
  return (
    {
      type: 'image',
      url: 'http://bjm.smilehehe.com/uploadFiles/uploadImgs/haibao.jpg',
      css: {
        top: `0rpx`,
        left: `0rpx`,
        width: '720rpx',
        height: '1200rpx',
      },
    }
  );
}
function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
