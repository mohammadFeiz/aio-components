import { createRef, useContext, createContext, useState, useEffect, useRef, Fragment, createElement as _createElement } from 'react';
import $ from 'jquery';
import AIOPopup from "aio-popup";
import Prism from 'prismjs';
import { Get2Digit, AIODate, GetClient, EventHandler, Swip, DragClass, AddToAttrs, Storage, ExportToExcel, getEventAttrs, svgArc, HasClass, FilePreview, DownloadFile, GetPrecisionCount, GetArray, Validation, GetSvg } from 'aio-utils';
import './index.css';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const AICTX = /*#__PURE__*/createContext({});
const AIOInput = props => {
  let type = props.type,
    round = props.round;
  let value = props.value;
  if (type === 'text') {
    if (typeof value !== 'string') {
      value = '';
    }
  } else if (type === 'number') {
    if (typeof value !== 'number') {
      value = undefined;
    }
  }
  if (type === 'spinner') {
    type = 'range';
    if (!round || typeof round !== 'number') {
      round = 1;
    }
  } else if (type === 'slider') {
    type = 'range';
    round = 0;
  } else if (type === 'range') {
    return null;
  }
  const defaultProps = new Storage('aio-input-storage').getModel() || {};
  let rootProps = {
    ...props,
    type,
    round,
    value,
    ...defaultProps
  };
  if (type === 'text' && rootProps.fetchOptions) {
    return /*#__PURE__*/_jsx(SuggestionInput, {
      ...rootProps
    });
  }
  return /*#__PURE__*/_jsx(AIOINPUT, {
    ...rootProps
  });
};
export default AIOInput;
const SuggestionInput = props => {
  const [searchResult, SetSearchResult] = useState([]);
  const [value, setValue] = useState('');
  async function setSearchResult(newValue) {
    setValue(newValue);
    if (!newValue) {
      SetSearchResult([]);
      return;
    }
    const res = props.fetchOptions ? await props.fetchOptions(newValue) : [];
    SetSearchResult(res);
  }
  return /*#__PURE__*/_jsx(AIOInput, {
    ...props,
    value: value,
    options: searchResult,
    option: {
      ...props.option,
      onClick: optionDetails => {
        const text = GetOptionProps({
          rootProps: props,
          key: 'text',
          optionDetails
        });
        setSearchResult(text);
        if (props.onChange) {
          props.onChange(text, optionDetails.option);
        }
      }
    },
    fetchOptions: undefined,
    onChange: newValue => {
      setSearchResult(newValue);
      if (props.onChange) {
        props.onChange(newValue);
      }
    }
  });
};
function AIOINPUT(props) {
  let [types] = useState(getTypes(props));
  let [DATE] = useState(new AIODate());
  props = getDefaultProps(props, types);
  let {
    type,
    value,
    onChange,
    attrs = {},
    rtl
  } = props;
  let [parentDom] = useState( /*#__PURE__*/createRef());
  let [datauniqid] = useState('aiobutton' + Math.round(Math.random() * 10000000));
  let [openPopover] = useState(getOpenPopover);
  let [error, setError] = useState();
  useEffect(() => {
    validate();
  }, [props.value]);
  function validate() {
    const {
      validations,
      lang = 'en',
      label,
      reportError = () => {}
    } = props;
    if (!validations) {
      return;
    }
    const title = label || '';
    const res = new Validation({
      value,
      title: title.replace(/\*/g, ''),
      lang,
      validations
    }).validate();
    reportError(res);
    setError(res);
  }
  function getOpenPopover() {
    if (!types.isDropdown) {
      return false;
    }
    let className = 'aio-input-popover';
    className += ` aio-input-popover-${rtl ? 'rtl' : 'ltr'}`;
    if (types.hasOption) {
      className += ' aio-input-dropdown';
    }
    if (type === 'time') {
      className += ' aio-input-time-popover';
    }
    return dom => {
      let popover = {
        ...(props.popover || {})
      };
      let {
        type,
        multiple
      } = props;
      let {
        body,
        limitTo,
        header,
        setAttrs = () => {
          return {};
        },
        position = 'popover'
      } = popover;
      let target = $(dom.current);
      let fitHorizontal = ['text', 'number', 'textarea'].indexOf(type) !== -1 || type === 'select' && !!multiple || !!popover.fitHorizontal;
      let config = {
        //props that have default but can change by user
        position,
        fitHorizontal,
        //props that havent default but can define by user(header,footer,fitTo,fixStyle)
        limitTo,
        header,
        //props that cannot change by user
        onClose: () => toggle(false),
        body: ({
          close
        }) => {
          if (body) {
            return body({
              close
            });
          } else if (type === 'date') {
            return /*#__PURE__*/_jsx(Calendar, {
              onClose: close
            });
          } else if (type === 'time') {
            return /*#__PURE__*/_jsx(TimePopover, {
              onClose: close
            });
          } else {
            return /*#__PURE__*/_jsx(Options, {});
          }
        },
        pageSelector: '.aio-input-backdrop.' + datauniqid,
        getTarget: () => target,
        setAttrs: key => {
          let attrs = setAttrs(key);
          if (key === 'modal') {
            return AddToAttrs(attrs, {
              className
            });
          }
          if (key === 'backdrop') {
            return AddToAttrs(attrs, {
              className: 'aio-input-backdrop ' + datauniqid
            });
          }
        }
      };
      return config;
    };
  }
  let [popup] = useState(getPopup(AIOPopup));
  function getPopup(ctor) {
    return new ctor({
      rtl: props.rtl
    });
  }
  let [open, setOpen] = useState(!!props.open);
  let [showPassword, SetShowPassword] = useState(false);
  function setShowPassword(state) {
    SetShowPassword(state === undefined ? !showPassword : state);
  }
  let [DragOptions] = useState(new DragClass({
    callback: (fromData, toData) => {
      if (typeof props.onSwap === 'function') {
        const {
          fromIndex
        } = fromData;
        const {
          options,
          toIndex
        } = toData;
        const sorted = DragOptions.reOrder(options, fromIndex, toIndex);
        props.onSwap(sorted, options[fromIndex], options[toIndex]);
      }
    }
  }));
  function toggle(popover) {
    let open = !!popup.getModals().length;
    if (!!popover === !!open) {
      return;
    }
    setOpen(!!popover);
    if (popover) {
      popup.addModal(popover);
    } else {
      popup.removeModal();
      setTimeout(() => $(parentDom.current).focus(), 0);
    }
  }
  function click(e, dom) {
    if (type === 'checkbox') {
      if (onChange) {
        onChange(!value, e);
      }
    } else if (openPopover !== false) {
      toggle(openPopover(dom));
    } else if (typeof props.onClick === 'function') {
      props.onClick(e);
    } else if (attrs.onClick) {
      attrs.onClick();
    }
  }
  function optionClick(option) {
    let {
      attrs = {},
      onClick,
      close
    } = option;
    if (onClick) {
      onClick(option.details);
    } else if (attrs.onClick) {
      attrs.onClick(option);
    } else if (onChange) {
      if (types.isInput) {/*do nothing*/} else if (type === 'tree') {/*do nothing*/} else if (type === 'file') {/*do nothing*/} else if (types.isMultiple) {
        let {
            multiple
          } = props,
          newValue;
        if (value.indexOf(option.value) === -1) {
          newValue = value.concat(option.value);
        } else {
          newValue = value.filter(o => o !== option.value);
        }
        while (typeof multiple === 'number' && newValue.length > multiple) {
          newValue = newValue.slice(1, newValue.length);
        }
        onChange(newValue, option.details);
      } else {
        if (option.value !== props.value) {
          onChange(option.value, option.details);
        } else if (props.deSelect === true) {
          onChange(undefined, option.details);
        } else if (typeof props.deSelect === 'function') {
          props.deSelect();
        }
      }
    }
    if (close) {
      toggle(false);
    }
  }
  function getOptions() {
    let options = [];
    if (type === 'date') {
      if (!props.multiple) {
        return {
          optionsList: [],
          optionsDic: {}
        };
      }
      options = [...props.value];
    } else if (typeof props.options === 'function') {
      options = props.options();
    } else if (props.options) {
      options = props.options;
    } else {
      options = [];
    }
    return GetOptions({
      rootProps: props,
      types,
      options
    });
  }
  function getContext() {
    let context = {
      error,
      options: getOptions(),
      rootProps: {
        ...props,
        value
      },
      datauniqid,
      touch: 'ontouchstart' in document.documentElement,
      DragOptions,
      open,
      click,
      optionClick,
      types,
      showPassword,
      setShowPassword,
      DATE
    };
    return context;
  }
  function getRangeClassName() {
    let {
      round,
      vertical
    } = props;
    if (round) {
      return 'aio-input-range-round';
    }
    if (vertical) {
      return 'aio-input-range-vertical';
    }
    return 'aio-input-range-horizontal';
  }
  let render = {
    spinner: () => null,
    slider: () => null,
    acardion: () => /*#__PURE__*/_jsx(Acardion, {}),
    tree: () => /*#__PURE__*/_jsx(Tree, {}),
    tags: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Tags, {})
      }
    }),
    list: () => /*#__PURE__*/_jsx(List, {}),
    file: () => /*#__PURE__*/_jsx(File, {}),
    select: () => /*#__PURE__*/_jsx(Select, {}),
    table: () => /*#__PURE__*/_jsx(Table, {}),
    checkbox: () => /*#__PURE__*/_jsx(Layout, {}),
    button: () => /*#__PURE__*/_jsx(Layout, {}),
    range: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Range, {}),
        className: getRangeClassName()
      }
    }),
    radio: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Options, {})
      }
    }),
    tabs: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Options, {})
      }
    }),
    buttons: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Options, {})
      }
    }),
    date: () => /*#__PURE__*/_jsx(DateInput, {}),
    time: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: getTimeText(props)
      }
    }),
    image: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Image, {})
      }
    }),
    text: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Input, {})
      }
    }),
    password: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Input, {})
      }
    }),
    textarea: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Input, {})
      }
    }),
    number: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Input, {})
      }
    }),
    color: () => /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: /*#__PURE__*/_jsx(Input, {})
      }
    })
  };
  if (!type || !render[type]) {
    return null;
  }
  return /*#__PURE__*/_jsxs(AICTX.Provider, {
    value: getContext(),
    children: [render[type](), popup.render()]
  }, datauniqid);
}
function TimePopover(props) {
  let {
    DATE,
    rootProps
  } = useContext(AICTX);
  let {
    jalali,
    onChange,
    size = 12
  } = rootProps;
  let {
    onClose
  } = props;
  let [value, setValue] = useState(getTimeByUnit(rootProps));
  let [startYear] = useState(value.year ? value.year - 10 : undefined);
  let [endYear] = useState(value.year ? value.year + 10 : undefined);
  function change(obj) {
    setValue({
      ...value,
      ...obj
    });
  }
  function translate(key) {
    return !!jalali ? {
      'year': 'سال',
      'month': 'ماه',
      'day': 'روز',
      'hour': 'ساعت',
      'minute': 'دقیقه',
      'second': 'ثانیه',
      'Submit': 'ثبت',
      'Now': 'اکنون'
    }[key] : key;
  }
  function getTimeOptions(type) {
    let {
      year,
      month,
      day
    } = value;
    if (type === 'year' && startYear && endYear) {
      return GetArray(endYear - startYear + 1, i => ({
        text: i + startYear,
        value: i + startYear
      }));
    }
    if (type === 'day' && day) {
      let length = !year || !month ? 31 : DATE.getMonthDaysLength([year, month]);
      if (day > length) {
        change({
          day: 1
        });
      }
      return GetArray(length, i => {
        return {
          text: i + 1,
          value: i + 1
        };
      });
    }
    if (type === 'month') {
      return GetArray(12, i => ({
        text: i + 1,
        value: i + 1
      }));
    }
    return GetArray(type === 'hour' ? 24 : 60, i => ({
      text: i,
      value: i
    }));
  }
  function layout(type) {
    if (typeof value[type] !== 'number') {
      return null;
    }
    let options = getTimeOptions(type);
    let p = {
      type: 'list',
      value: value[type],
      options,
      size: size * 2.5,
      onChange: v => change({
        [type]: v
      })
    };
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-time-popover-item",
      children: [/*#__PURE__*/_jsx("div", {
        className: "aio-input-time-popover-item-title",
        children: translate(type)
      }), /*#__PURE__*/_jsx(AIOInput, {
        ...p
      }), /*#__PURE__*/_jsx("div", {
        className: "aio-input-time-popover-highlight"
      })]
    });
  }
  function submit() {
    if (onChange) {
      onChange(value);
    }
    onClose();
  }
  function now() {
    setValue(getTimeByUnit(rootProps, true));
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-time-popover-content aio-input-theme-bg1 aio-input-theme-color0",
    style: {
      fontSize: size
    },
    children: [/*#__PURE__*/_jsxs("div", {
      className: "aio-input-time-popover-body",
      children: [layout('year'), " ", layout('month'), " ", layout('day'), " ", layout('hour'), " ", layout('minute'), " ", layout('second')]
    }), /*#__PURE__*/_jsxs("div", {
      className: "aio-input-time-popover-footer",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: submit,
        children: translate('Submit')
      }), rootProps.now !== false && /*#__PURE__*/_jsx("button", {
        onClick: () => now(),
        children: translate('Now')
      })]
    })]
  });
}
function Image() {
  let {
    rootProps
  } = useContext(AICTX);
  let [popup] = useState(new AIOPopup());
  let {
    value,
    attrs,
    onChange,
    disabled,
    placeholder,
    preview,
    deSelect,
    imageAttrs = {}
  } = rootProps;
  let [url, setUrl] = useState();
  let dom = /*#__PURE__*/createRef();
  // if(typeof value === 'object'){
  //     let fr = new FileReader();
  //     fr.onload = function () {
  //         $(dom.current).attr('src',fr.result)
  //     }
  //     fr.readAsDataURL(value);
  // }
  useEffect(() => {
    if (!value || value === null) {
      if (url !== value) {
        setUrl('');
      }
    } else if (typeof value === 'object') {
      changeUrl(value);
    } else if (typeof value === 'string') {
      if (url !== value) {
        setUrl(value);
      }
    }
  });
  function changeUrl(file, callback) {
    try {
      let fr = new FileReader();
      fr.onload = function () {
        if (url !== fr.result) {
          setUrl(fr.result);
          if (callback) {
            callback(fr.result);
          }
        }
      };
      fr.readAsDataURL(file);
    } catch {}
  }
  function onPreview(e) {
    e.stopPropagation();
    e.preventDefault();
    openPopup();
  }
  function openPopup() {
    popup.addModal({
      position: 'center',
      header: {
        title: '',
        onClose: () => popup.removeModal()
      },
      body: () => /*#__PURE__*/_jsx("div", {
        className: "aio-input-image-preview-popup",
        children: /*#__PURE__*/_jsx("img", {
          src: $(dom.current).attr('src'),
          alt: placeholder
        })
      })
    });
  }
  let IMG = url ? /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("img", {
      ref: dom,
      src: url,
      alt: placeholder,
      style: {
        objectFit: 'contain',
        cursor: !onChange ? 'default' : undefined
      },
      onClick: !!onChange ? undefined : onPreview,
      height: "100%",
      ...imageAttrs
    }), !!deSelect && /*#__PURE__*/_jsx("div", {
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        if (typeof deSelect === 'function') {
          deSelect();
        } else if (onChange) {
          onChange('');
        }
      },
      className: "aio-input-image-remove",
      children: I('mdiClose', 1)
    }), preview && !!onChange && /*#__PURE__*/_jsx("div", {
      onClick: e => onPreview(e),
      className: "aio-input-image-preview",
      children: I('mdiImage', 1)
    }), popup.render()]
  }) : /*#__PURE__*/_jsx("span", {
    ...attrs,
    className: "aio-input-image-placeholder",
    children: placeholder || 'placeholder'
  });
  if (!onChange) {
    return IMG;
  }
  let p = {
    disabled,
    justify: true,
    text: IMG,
    attrs: {
      style: {
        width: '100%',
        height: '100%',
        padding: 0
      }
    },
    onChange: file => changeUrl(file, url => onChange(url))
  };
  return /*#__PURE__*/_jsx(AIFile, {
    ...p
  });
}
function File() {
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-file-container",
    children: [/*#__PURE__*/_jsx(Layout, {}), /*#__PURE__*/_jsx(FileItems, {})]
  });
}
function InputFile() {
  let {
    rootProps,
    types
  } = useContext(AICTX);
  let {
    value = [],
    onChange = () => {},
    disabled,
    multiple,
    inputAttrs
  } = rootProps;
  function change(e) {
    let Files = e.target.files;
    let result;
    if (types.isMultiple) {
      result = [...value];
      let names = result.map(({
        name
      }) => name);
      for (let i = 0; i < Files.length; i++) {
        let file = Files[i];
        if (names.indexOf(file.name) !== -1) {
          continue;
        }
        result.push({
          name: file.name,
          size: file.size,
          file
        });
      }
      if (typeof multiple === 'number') {
        while (result.length > multiple) {
          result = result.slice(1, result.length);
        }
      }
    } else {
      result = Files.length ? Files[0] : undefined;
    }
    onChange(result);
  }
  let props = {
    disabled: disabled === true,
    type: 'file',
    style: {
      display: 'none'
    },
    multiple: types.isMultiple,
    onChange: e => change(e),
    ...inputAttrs
  };
  return /*#__PURE__*/_jsx("input", {
    ...props
  });
}
function FileItems() {
  let {
    rootProps
  } = useContext(AICTX);
  let {
    value,
    rtl
  } = rootProps;
  let files = [];
  if (Array.isArray(value)) {
    files = value;
  } else if (value) {
    files = [value];
  } else {
    return null;
  }
  if (!files.length) {
    return null;
  }
  let Files = files.map((file, i) => {
    return /*#__PURE__*/_jsx(FileItem, {
      file: file,
      index: i
    }, i);
  });
  return /*#__PURE__*/_jsx("div", {
    className: "aio-input-files",
    style: {
      direction: rtl ? 'rtl' : 'ltr'
    },
    children: Files
  });
}
const FileItem = props => {
  let {
    rootProps,
    types
  } = useContext(AICTX);
  let {
    onChange = () => {},
    value = []
  } = rootProps;
  let {
    file,
    index
  } = props;
  function getFile(file) {
    let filename = file.name || 'untitle';
    let fileSize = file.size || 0;
    let nameLength = 20;
    try {
      let minName, sizeString;
      let lastDotIndex = filename.lastIndexOf('.');
      let name = filename.slice(0, lastDotIndex);
      let format = filename.slice(lastDotIndex + 1, filename.length);
      if (name.length > nameLength) {
        minName = name.slice(0, Math.floor(nameLength / 2)) + '...' + name.slice(name.length - Math.floor(nameLength / 2), name.length) + '.' + format;
      } else {
        minName = filename;
      }
      let size = fileSize;
      if (!size) {
        return {
          minName,
          sizeString: false
        };
      }
      let gb = size / (1024 * 1024 * 1024),
        mb = size / (1024 * 1024),
        kb = size / 1024;
      if (gb >= 1) {
        sizeString = gb.toFixed(2) + ' GB';
      } else if (mb >= 1) {
        sizeString = mb.toFixed(2) + ' MB';
      } else if (kb >= 1) {
        sizeString = kb.toFixed(2) + ' KB';
      } else {
        sizeString = size + ' byte';
      }
      return {
        minName,
        sizeString
      };
    } catch {
      return {
        minName: 'untitle',
        sizeString: false
      };
    }
  }
  async function remove(e, index) {
    e.stopPropagation();
    e.preventDefault();
    if (typeof rootProps.onRemove === 'function') {
      const res = await rootProps.onRemove({
        row: value[index],
        rowIndex: index
      });
      if (res === false) {
        return;
      }
    }
    let newValue = [];
    for (let i = 0; i < value.length; i++) {
      if (i === index) {
        continue;
      }
      newValue.push(value[i]);
    }
    onChange(newValue);
  }
  function download() {
    DownloadFile(file);
  }
  function getIcon() {
    let filePreview;
    if (rootProps.preview) {
      filePreview = FilePreview(file, {
        onClick: () => download()
      });
    }
    if (filePreview && filePreview !== null) {
      return filePreview;
    }
    return /*#__PURE__*/_jsx("div", {
      className: "aio-input-file-item-icon",
      onClick: () => download(),
      children: I('mdiAttachment', .8)
    });
  }
  let {
    minName,
    sizeString
  } = getFile(file);
  let {
    optionsList
  } = GetOptions({
    rootProps,
    types,
    options: [{
      minName,
      sizeString,
      index
    }],
    defaultOptionProps: {
      subtext: () => sizeString,
      text: () => minName,
      before: () => getIcon(),
      after: () => /*#__PURE__*/_jsx("div", {
        className: "aio-input-file-item-icon",
        onClick: e => remove(e, index),
        children: I('mdiClose', .7)
      })
    }
  });
  let option = optionsList[0];
  return /*#__PURE__*/_jsx(Layout, {
    option: option
  });
};
function Select() {
  let {
    rootProps,
    types,
    options
  } = useContext(AICTX);
  let {
    value,
    hideTags
  } = rootProps;
  let values = Array.isArray(value) ? [...value] : value !== undefined ? [value] : [];
  function getSelectText() {
    if (!values.length) {
      return;
    }
    let option = options.optionsDic['a' + values[0]];
    if (!option) {
      return;
    }
    return option.text;
  }
  if (types.isMultiple) {
    return /*#__PURE__*/_jsxs("div", {
      className: 'aio-input-multiselect-container',
      children: [/*#__PURE__*/_jsx(Layout, {}), !hideTags && !!values.length && /*#__PURE__*/_jsx(Tags, {})]
    });
  } else {
    return /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: rootProps.text || getSelectText()
      }
    });
  }
}
function DateInput() {
  let {
    rootProps,
    types
  } = useContext(AICTX);
  let {
    value,
    hideTags
  } = rootProps;
  let values = Array.isArray(value) ? [...value] : value !== undefined ? [value] : [];
  function getDateText() {
    let {
      value,
      unit = Def('date-unit'),
      text,
      pattern: PT,
      jalali,
      placeholder
    } = rootProps;
    if (value) {
      text = PT !== undefined ? PT : text;
      let DATE = new AIODate();
      let list = DATE.convertToArray(value);
      let [year, month = 1, day = 1, hour = 0] = list;
      list = [year, month, day, hour];
      let pattern = '{}';
      let splitter = DATE.getSplitter(value);
      if (text && (typeof text === 'string' || typeof text === 'number')) {
        pattern = text.toString();
      } else if (unit === 'month') {
        pattern = `{year}${splitter}{month}`;
      } else if (unit === 'day') {
        pattern = `{year}${splitter}{month}${splitter}{day}`;
      } else if (unit === 'hour') {
        pattern = `{year}${splitter}{month}${splitter}{day} - {hour} : 00`;
      }
      return /*#__PURE__*/_jsx("div", {
        style: {
          direction: 'ltr'
        },
        children: DATE.getDateByPattern(list, pattern)
      });
    }
    return placeholder || (!jalali ? 'Select Date' : 'انتخاب تاریخ');
  }
  if (types.isMultiple) {
    return /*#__PURE__*/_jsxs("div", {
      className: 'aio-input-multiselect-container',
      children: [/*#__PURE__*/_jsx(Layout, {
        properties: {
          text: rootProps.text || 'Select Dates'
        }
      }), !hideTags && !!values.length && /*#__PURE__*/_jsx(Tags, {})]
    });
  } else {
    return /*#__PURE__*/_jsx(Layout, {
      properties: {
        text: getDateText()
      }
    });
  }
}
const Tags = () => {
  let {
    rootProps,
    options
  } = useContext(AICTX);
  let {
    value = [],
    rtl,
    disabled,
    onChange = () => {}
  } = rootProps;
  let tags = value.map((o, i) => {
    let option = options.optionsDic['a' + o];
    if (option === undefined) {
      return null;
    }
    return /*#__PURE__*/_jsx(Tag, {
      onClose: () => onChange(rootProps.value.filter(rpv => rpv !== o)),
      attrs: option.tagAttrs,
      before: option.tagBefore,
      after: option.tagAfter,
      text: option.text,
      disabled: option.disabled
    }, i);
  });
  return !tags.length ? null : /*#__PURE__*/_jsx("div", {
    className: `aio-input-tags-container aio-input-scroll${rtl ? ' rtl' : ''}${disabled ? ' disabled' : ''}`,
    children: tags
  });
};
const Tag = props => {
  let {
    attrs,
    before = I('mdiCircleMedium', 0.7),
    after,
    text,
    disabled,
    onClose = () => {}
  } = props;
  let close = disabled ? undefined : onClose;
  let cls = 'aio-input-tag';
  let Attrs = AddToAttrs(attrs, {
    className: [cls + ' aio-input-main-bg', disabled ? 'disabled' : undefined]
  });
  return /*#__PURE__*/_jsxs("div", {
    ...Attrs,
    children: [/*#__PURE__*/_jsx("div", {
      className: `${cls}-icon`,
      children: before
    }), /*#__PURE__*/_jsx("div", {
      className: `${cls}-text`,
      children: text
    }), after !== undefined && /*#__PURE__*/_jsx("div", {
      className: `${cls}-icon`,
      children: after
    }), /*#__PURE__*/_jsx("div", {
      className: `${cls}-icon`,
      onClick: close,
      children: I('mdiClose', 0.7)
    })]
  });
};
function Input() {
  let {
    rootProps,
    types,
    showPassword,
    options
  } = useContext(AICTX);
  let {
    type,
    delay = 500
  } = rootProps;
  let {
    min,
    max,
    swip,
    onChange,
    blurChange,
    maxLength = Infinity,
    justNumber,
    filter = [],
    disabled,
    placeholder,
    inputAttrs,
    spin = true,
    justify
  } = rootProps;
  let [dom] = useState( /*#__PURE__*/createRef());
  let [temp] = useState({
    atimeout: undefined,
    btimeout: undefined,
    clicked: false
  });
  let [datauniqid] = useState(`ac${Math.round(Math.random() * 100000)}`);
  let [value, setValue] = useState(rootProps.value || '');
  let valueRef = useRef(value);
  valueRef.current = value;
  function setSwip() {
    if (type === 'number' && swip) {
      new Swip({
        speedY: swip,
        reverseY: true,
        minY: min,
        maxY: max,
        dom: () => $(dom.current),
        start: () => {
          let vref = +valueRef.current;
          vref = isNaN(vref) ? 0 : vref;
          return [0, vref];
        },
        move: p => {
          let {
            y
          } = p.change || {
            y: 0
          };
          if (min !== undefined && y < min) {
            y = min;
          }
          if (max !== undefined && y > max) {
            y = max;
          }
          change(y, onChange);
        }
      });
    }
  }
  useEffect(() => {
    setSwip();
  }, []);
  function getValidValue() {
    let v = rootProps.value;
    if (type === 'number') {
      if (v === '') {
        return undefined;
      } //important because +('') is 0
      else if (!isNaN(+v)) {
        v = +v;
        if (typeof min === 'number' && v < min) {
          v = min;
        } else if (typeof max === 'number' && v > max) {
          v = max;
        }
      }
    }
    return v;
  }
  function update() {
    clearTimeout(temp.atimeout);
    temp.atimeout = setTimeout(() => {
      let v = getValidValue();
      if (v !== value) {
        setValue(v);
      }
    }, delay);
  }
  useEffect(() => {
    update();
  }, [rootProps.value]);
  function convertPersianDigits(value) {
    try {
      value = value.toString();
      let res = '';
      for (let i = 0; i < value.length; i++) {
        let dic = {
          "۰": "0",
          "۱": "1",
          "۲": "2",
          "۳": "3",
          "۴": "4",
          "۵": "5",
          "۶": "6",
          "۷": "7",
          "۸": "8",
          "۹": "9"
        };
        res += dic[value[i]] || value[i];
      }
      value = res;
    } catch {}
    return value;
  }
  function change(value, onChange) {
    if (types.hasKeyboard) {
      if (value) {
        value = convertPersianDigits(value);
        if ((type === 'text' || type === 'textarea' || type === 'password') && justNumber) {
          value = value.toString();
          let lastChar = value[value.length - 1];
          if (lastChar === ' ' || isNaN(+lastChar)) {
            if (Array.isArray(justNumber)) {
              if (justNumber.indexOf(lastChar) === -1) {
                value = value.slice(0, value.length - 1);
              }
            } else {
              value = value.slice(0, value.length - 1);
            }
          }
        }
        if ((type === 'text' || type === 'textarea' || type === 'password') && filter.length) {
          value = value.toString();
          let lastChar = value[value.length - 1];
          for (let i = 0; i < filter.length; i++) {
            let char = filter[i].toString();
            if (char === 'symbol') {
              if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(lastChar)) {
                value = value.slice(0, value.length - 1);
                break;
              }
            } else if (char === 'number') {
              if (!isNaN(+lastChar)) {
                value = value.slice(0, value.length - 1);
                break;
              }
            } else if (char === 'string') {
              if (isNaN(+lastChar)) {
                value = value.slice(0, value.length - 1);
                break;
              }
            } else {
              if (char === lastChar) {
                value = value.slice(0, value.length - 1);
                break;
              }
            }
          }
        }
        if ((type === 'text' || type === 'textarea' || type === 'password') && value.toString().length > maxLength) {
          value = value.toString().slice(0, maxLength);
        }
        try {
          if (type === 'number' && value.toString().length > maxLength) {
            value = +value.toString().slice(0, maxLength);
          }
        } catch {}
      }
    }
    if (rootProps.type === 'number') {
      if (value !== '') {
        value = +value;
      } else {
        value = undefined;
      }
    }
    setValue(value);
    if (!blurChange && onChange) {
      clearTimeout(temp.btimeout);
      temp.btimeout = setTimeout(() => onChange(value), delay);
    }
  }
  function click() {
    if (rootProps.autoHighlight === false) {
      return;
    }
    if (temp.clicked) {
      return;
    }
    temp.clicked = true;
    $(dom.current).focus().select();
  }
  function blur(onChange) {
    temp.clicked = false;
    if (blurChange && onChange) {
      onChange(value);
    }
  }
  function getInputAttrs() {
    let InputAttrs = AddToAttrs(inputAttrs, {
      className: !spin ? 'no-spin' : undefined,
      style: justify ? {
        textAlign: 'center'
      } : undefined
    });
    let p = {
      ...InputAttrs,
      value,
      type,
      ref: dom,
      disabled,
      placeholder,
      list: rootProps.options ? datauniqid : undefined,
      onClick: e => click(),
      onChange: onChange ? e => change(e.target.value, onChange) : undefined,
      onBlur: () => blur(onChange)
    };
    if (type === 'password' && showPassword) {
      p = {
        ...p,
        type: 'text',
        style: {
          ...p.style,
          textAlign: 'center'
        }
      };
    }
    if (justNumber === true) {
      p.pattern = "\d*";
      p.inputMode = "numeric";
    }
    return p;
  }
  let attrs = getInputAttrs();
  if (!attrs.onChange) {
    return value;
  } else if (type === 'color') {
    return /*#__PURE__*/_jsxs("label", {
      style: {
        width: '100%',
        height: '100%',
        background: value
      },
      children: [/*#__PURE__*/_jsx("input", {
        ...attrs,
        style: {
          opacity: 0
        },
        opacity: true,
        rgba: true,
        cmyk: true,
        hsla: true
      }), !!options.optionsList.length && /*#__PURE__*/_jsx("datalist", {
        id: datauniqid,
        children: options.optionsList.map(o => /*#__PURE__*/_jsx("option", {
          value: o.value
        }))
      })]
    });
  } else if (type === 'textarea') {
    return /*#__PURE__*/_jsx("textarea", {
      ...attrs
    });
  } else {
    return /*#__PURE__*/_jsx("input", {
      ...attrs
    });
  }
}
function Options() {
  let {
    rootProps,
    types,
    options
  } = useContext(AICTX);
  let [searchValue, setSearchValue] = useState('');
  function renderSearchBox(options) {
    if (rootProps.type === 'tabs' || rootProps.type === 'buttons' || types.isInput || !rootProps.search) {
      return null;
    }
    if (searchValue === '' && options.length < 10) {
      return null;
    }
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-search",
      children: [/*#__PURE__*/_jsx("input", {
        type: "text",
        value: searchValue,
        placeholder: rootProps.search,
        onChange: e => setSearchValue(e.target.value)
      }), /*#__PURE__*/_jsx("div", {
        className: "aio-input-search-icon",
        onClick: () => {
          setSearchValue('');
        },
        children: I(searchValue ? 'mdiClose' : 'mdiMagnify', .8)
      })]
    });
  }
  function getRenderOptions(options) {
    return options.map((option, i) => {
      if (searchValue) {
        if (option.text === undefined || option.text === '' || option.text === null) {
          return null;
        }
        if (option.text.indexOf(searchValue) === -1) {
          return null;
        }
      }
      let p = {
        option,
        index: i,
        searchValue
      };
      return /*#__PURE__*/_createElement(Layout, {
        ...p,
        key: i
      });
    });
  }
  if (!options.optionsList.length) {
    return null;
  }
  let renderOptions = getRenderOptions(options.optionsList);
  let className = `aio-input-options aio-input-scroll aio-input-${rootProps.type}-options`;
  if (types.isDropdown) {
    className += ' aio-input-dropdown-options';
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-options-container",
    children: [renderSearchBox(options.optionsList), /*#__PURE__*/_jsx("div", {
      className: className,
      children: renderOptions
    })]
  });
}
const Layout = props => {
  let {
    rootProps,
    datauniqid,
    types,
    touch,
    DragOptions,
    click,
    optionClick,
    open,
    showPassword,
    setShowPassword,
    error
  } = useContext(AICTX);
  let {
    option,
    index,
    toggle,
    indent
  } = props;
  let {
    type,
    rtl
  } = rootProps;
  let [dom] = useState( /*#__PURE__*/createRef());
  function getClassName() {
    let cls;
    if (option !== undefined) {
      cls = `aio-input-option aio-input-${type}-option`;
      if (types.isMultiple) {
        cls += ` aio-input-${type}-multiple-option`;
      }
      if (types.isDropdown) {
        cls += ` aio-input-dropdown-option`;
      }
      if (option.details.active === true) {
        cls += ' active';
        if (type === 'tabs') {
          cls += ' aio-input-main-color';
        }
        if (type === 'buttons') {
          cls += ' aio-input-main-bg';
        }
      }
    } else {
      cls = `aio-input aio-input-${type}${touch ? ' aio-input-touch' : ''}`;
      if (types.isInput) {
        cls += ` aio-input-input`;
      }
      if (rootProps.justify) {
        cls += ' aio-input-justify';
      }
      if (error) {
        cls += ' has-error';
      }
      cls += rtl ? ' aio-input-rtl' : ' aio-input-ltr';
    }
    if (indent) {
      cls += ` aio-input-indent-${indent.size}`;
    }
    if (type === 'tree') {
      let size = rootProps.size || Def('tree-size');
      size = Math.round(size / 12) * 12;
      if (size < 24) {
        size = 24;
      }
      if (size > 120) {
        size = 120;
      }
      cls += ` aio-input-size-${size}`;
    }
    if (properties.disabled === true) {
      cls += ' disabled';
    }
    if (properties.className) {
      cls += ' ' + properties.className;
    }
    cls += ' ' + datauniqid;
    return cls;
  }
  function cls(key) {
    let className = `aio-input-${key}`;
    if (option) {
      className += ` aio-input-${type}-option-${key}`;
    } else {
      className += ` aio-input-${type}-${key}`;
    }
    return className;
  }
  function Text() {
    let {
      text,
      placeholder,
      subtext,
      justify
    } = properties;
    if (text === undefined && placeholder !== undefined) {
      text = /*#__PURE__*/_jsx("div", {
        className: "aio-input-placeholder",
        children: placeholder
      });
    }
    if (text !== undefined) {
      let p = type => {
        return {
          className: `${cls(type)}${justify && !types.isInput ? ' aio-input-value-justify' : ''}`
        };
      };
      if (subtext) {
        return /*#__PURE__*/_jsxs("div", {
          className: `aio-input-content aio-input-${type}-content${justify && !types.isInput ? ' aio-input-content-justify' : ''}`,
          children: [/*#__PURE__*/_jsx("div", {
            ...p('value'),
            children: text
          }), /*#__PURE__*/_jsx("div", {
            ...p('subtext'),
            children: subtext
          })]
        });
      } else {
        return /*#__PURE__*/_jsx("div", {
          ...p('value'),
          children: text
        });
      }
    } else {
      return /*#__PURE__*/_jsx("div", {
        style: {
          flex: 1
        }
      });
    }
  }
  function DragIcon() {
    if (!properties.draggable) {
      return null;
    }
    return /*#__PURE__*/_jsx("svg", {
      viewBox: "8 4 10 13",
      role: "presentation",
      style: {
        width: 12,
        height: '1.8rem'
      },
      children: /*#__PURE__*/_jsx("path", {
        d: "M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",
        style: {
          fill: 'currentcolor'
        }
      })
    });
  }
  function Caret() {
    if (!types.isDropdown || option || types.isInput && !rootProps.options) {
      return null;
    }
    let {
      caret
    } = rootProps;
    if (caret === false) {
      return null;
    }
    return /*#__PURE__*/_jsx("div", {
      className: "aio-input-caret",
      children: caret === undefined ? I('mdiChevronDown', .8) : caret
    });
  }
  function CheckIcon() {
    let {
      checkIcon,
      checked
    } = properties;
    if (checked === undefined) {
      return null;
    }
    let {
      multiple
    } = rootProps;
    if (Array.isArray(checkIcon)) {
      return checkIcon[checked ? 1 : 0];
    }
    if (!multiple && type === 'radio') {
      return /*#__PURE__*/_jsx("div", {
        className: 'aio-input-check-out aio-input-main-color' + (checked ? ' checked' : ''),
        style: {
          ...checkIcon,
          background: 'none'
        },
        children: checked && /*#__PURE__*/_jsx("div", {
          className: 'aio-input-check-in aio-input-main-bg',
          style: {
            background: checkIcon.background
          }
        })
      });
    }
    return /*#__PURE__*/_jsx("div", {
      className: 'aio-input-check-0 aio-input-main-color' + (checked ? ' checked' : ''),
      style: {
        ...checkIcon,
        background: 'none'
      },
      children: checked && /*#__PURE__*/_jsx("div", {
        className: "aio-input-main-bg"
      })
    });
  }
  function BeforeAfter(mode) {
    let res;
    if (mode === 'after' && type === 'password' && rootProps.preview) {
      res = /*#__PURE__*/_jsx("div", {
        className: "align-v",
        onClick: () => setShowPassword(),
        children: I(showPassword ? 'mdiEyeOff' : 'mdiEye', .8)
      });
    } else {
      let v = properties[mode];
      res = typeof v === 'function' ? v() : v;
    }
    if (res === undefined) {
      return null;
    }
    return /*#__PURE__*/_jsx("div", {
      className: cls(mode),
      children: res
    });
  }
  function Loading() {
    let {
      loading
    } = properties;
    let elem;
    if (!loading) {
      return null;
    } else if (loading === true) {
      elem = I('mdiLoading', 0.8, {
        spin: .8
      });
    } else {
      elem = loading;
    }
    return /*#__PURE__*/_jsx("div", {
      className: cls('loading'),
      children: elem
    });
  }
  function getProps() {
    let {
      attrs,
      disabled,
      draggable,
      style
    } = properties;
    let zIndex;
    if (open && !option && ['text', 'number', 'textarea'].indexOf(type) !== -1) {
      zIndex = 100000;
    }
    let onClick;
    //ممکنه این یک آپشن باشه باید دیزیبل پرنتش هم چک بشه تا دیزیبل بشه
    if (!disabled) {
      if (option === undefined) {
        onClick = e => {
          e.stopPropagation();
          click(e, dom);
        };
      } else {
        onClick = e => {
          e.stopPropagation();
          e.preventDefault();
          if ((props.properties || {}).onClick) {
            props.properties.onClick();
          } else {
            optionClick(option);
          }
        };
      }
    }
    attrs = AddToAttrs(attrs, {
      className: getClassName(),
      style: {
        ...style,
        zIndex
      }
    });
    let p = {
      ...attrs,
      onClick,
      ref: dom,
      disabled
    };
    let options = typeof rootProps.options === 'function' ? rootProps.options() : rootProps.options || [];
    if (draggable) {
      p = {
        ...p,
        ...DragOptions.getDragAttrs({
          fromIndex: index || 0
        }),
        ...DragOptions.getDropAttrs({
          options,
          toIndex: index || 0
        })
      };
    }
    if (index) {
      p['data-index'] = index;
    }
    return p;
  }
  function getProperties() {
    let p = props.properties || {};
    let obj = option || rootProps; //اگر آپشن بود از آپشن وگر نه از پروپس بخون مقادیر رو
    let {
      draggable = option ? option.draggable : false
    } = p;
    let {
      placeholder = !option ? rootProps.placeholder : undefined
    } = p;
    let {
      checked = option ? option.checked : type === 'checkbox' ? !!rootProps.value : undefined
    } = p;
    let {
      disabled = obj.disabled
    } = p;
    let {
      text = obj.text
    } = p;
    let {
      subtext = obj.subtext
    } = p;
    let {
      justify = obj.justify
    } = p;
    let {
      checkIcon = obj.checkIcon === undefined ? {} : obj.checkIcon
    } = p;
    let {
      loading = obj.loading
    } = p;
    let {
      attrs = obj.attrs || {}
    } = p;
    let style = {
      ...(obj.style || {}),
      ...p.style
    };
    let {
      before = obj.before
    } = p;
    let {
      after = obj.after
    } = p;
    let {
      footer = obj.footer
    } = p;
    let classNames = [obj.className, p.className].filter(o => !!o);
    let className = classNames.length ? classNames.join(' ') : undefined;
    return {
      disabled,
      draggable,
      text,
      subtext,
      placeholder,
      justify,
      checked,
      checkIcon,
      loading,
      attrs,
      style,
      before,
      after,
      className,
      footer
    };
  }
  function getToggleIcon(open) {
    if (toggle === undefined) {
      return null;
    }
    if (option && Array.isArray(option.toggleIcon)) {
      if (open === false && !!option.toggleIcon[0]) {
        return option.toggleIcon[0];
      }
      if (open === true && !!option.toggleIcon[1]) {
        return option.toggleIcon[1];
      }
      if (open === undefined && !!option.toggleIcon[2]) {
        return option.toggleIcon[2];
      }
    }
    let path;
    if (open === undefined) {
      path = 'mdiCircleSmall';
    } else if (open === true) {
      path = 'mdiChevronDown';
    } else {
      path = 'mdiChevronRight';
    }
    return /*#__PURE__*/_jsx("div", {
      style: {
        transform: rootProps.rtl ? `scaleX(-1)` : undefined
      },
      children: I(path, 1)
    });
  }
  function Toggle(indent) {
    if (!option || option.toggleIcon === false) {
      return null;
    }
    if (toggle === undefined) {
      return null;
    }
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-toggle",
      onClick: e => {
        e.stopPropagation();
        toggle.action();
      },
      children: [/*#__PURE__*/_jsx("div", {
        className: "aio-input-toggle-icon",
        children: getToggleIcon(toggle.state)
      }), toggle.state === true && /*#__PURE__*/_jsx("svg", {
        className: "aio-input-toggle-line aio-input-indent-line",
        children: /*#__PURE__*/_jsx("path", {
          d: `M${indent.size / 2} ${0} L${indent.size / 2} ${indent.height / 2 - 12} Z`
        })
      })]
    });
  }
  function indentIcon(indent, order) {
    let {
      parentIndent,
      size,
      level,
      isLastChild,
      height
    } = indent;
    if (!level) {
      return false;
    }
    let x0 = size / 2,
      x1 = size,
      y0 = 0,
      y1 = height / 2,
      y2 = height,
      pathes = [];
    if (order === level - 1) {
      //horizontal line
      pathes.push( /*#__PURE__*/_jsx("path", {
        d: `M${x0} ${y1} L${x1 * (rootProps.rtl ? -1 : 1)} ${y1} Z`
      }, 'hl' + order));
      //vertical direct line
      pathes.push( /*#__PURE__*/_jsx("path", {
        d: `M${x0} ${y0} L${x0} ${isLastChild ? y1 : y2} Z`
      }, 'vdl' + order));
    } else {
      //vertical connet line
      if (!parentIndent || !parentIndent.isLastChild) {
        pathes.push( /*#__PURE__*/_jsx("path", {
          d: `M${x0} ${y0} L${x0} ${y2} Z`
        }, 'vl' + order));
      }
    }
    return /*#__PURE__*/_jsx("svg", {
      className: "aio-input-indent-line",
      children: pathes
    });
  }
  function Indent() {
    if (!indent) {
      return null;
    }
    let {
      level
    } = indent;
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-indents",
      children: [GetArray(level, i => /*#__PURE__*/_jsx("div", {
        className: `aio-input-indent`,
        children: indentIcon(indent, i)
      }, i)), !!toggle && Toggle(indent)]
    });
  }
  function Label() {
    if (option) {
      return null;
    }
    const {
      label
    } = rootProps;
    if (!label) {
      return null;
    }
    let className = 'aio-input-label';
    const required = label[0] === '*';
    if (required) {
      className += ' aio-input-label-required';
    }
    const finalLabel = required ? label.slice(1, label.length) : label;
    return /*#__PURE__*/_jsx("div", {
      className: className,
      children: finalLabel
    });
  }
  function getFooter() {
    if (option) {
      return null;
    }
    let text = '';
    if (properties.footer !== undefined) {
      text = properties.footer;
    } else if (error && rootProps.showErrors !== false) {
      text = error;
    }
    if (text !== undefined) {
      return /*#__PURE__*/_jsx("div", {
        className: "aio-input-footer",
        children: text
      });
    }
  }
  let properties = getProperties();
  let content = /*#__PURE__*/_jsxs(_Fragment, {
    children: [Indent(), DragIcon(), CheckIcon(), Label(), BeforeAfter('before'), Text(), BeforeAfter('after'), Loading(), Caret()]
  });
  let p = getProps();
  if (type === 'file') {
    return /*#__PURE__*/_jsxs("label", {
      ...p,
      children: [content, /*#__PURE__*/_jsx(InputFile, {})]
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    ...p,
    children: [content, !!option && type === 'tabs' && /*#__PURE__*/_jsx("div", {
      className: "aio-input-tabs-option-bar"
    }), getFooter()]
  });
};
function List() {
  let {
    rootProps,
    options
  } = useContext(AICTX);
  let {
    attrs = {},
    size = 36,
    listOptions = {
      count: 3,
      editable: true,
      stop: 3,
      decay: 8
    },
    onChange = () => {}
  } = rootProps;
  let {
    count = 3,
    editable = true,
    stop = 3,
    decay = 8
  } = listOptions;
  let optionsLength = options.optionsList.length;
  let [temp] = useState({
    dom: /*#__PURE__*/createRef(),
    activeIndex: 0,
    interval: undefined,
    moved: false,
    lastY: 0,
    deltaY: 0,
    so: {
      y: 0,
      top: 0,
      limit: {
        top: 0,
        bottom: 0
      }
    }
  });
  function getStyle() {
    var height = count * size;
    return {
      height
    };
  }
  function getIndexByTop(top) {
    return Math.round((count * size - size - 2 * top) / (2 * size));
  }
  function getTopByIndex(index) {
    return (count - 2 * index - 1) * size / 2;
  }
  function getContainerStyle() {
    return {
      top: getTopByIndex(temp.activeIndex)
    };
  }
  function moveDown() {
    if (temp.activeIndex >= optionsLength - 1) {
      return;
    }
    temp.activeIndex++;
    let newTop = getTopByIndex(temp.activeIndex);
    setStyle({
      top: newTop
    });
    setBoldStyle(temp.activeIndex);
  }
  function setBoldStyle(index) {
    $(temp.dom.current).find('.aio-input-list-option').removeClass('active');
    $(temp.dom.current).find('.aio-input-list-option[data-index=' + index + ']').addClass('active');
  }
  function moveUp() {
    if (temp.activeIndex <= 0) {
      return;
    }
    temp.activeIndex--;
    let newTop = getTopByIndex(temp.activeIndex);
    setStyle({
      top: newTop
    });
    setBoldStyle(temp.activeIndex);
  }
  function keyDown(e) {
    if (!editable) {
      return;
    }
    if (e.keyCode === 38) {
      moveUp();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  function getLimit() {
    return {
      top: getTopByIndex(-1),
      bottom: getTopByIndex(optionsLength)
    };
  }
  function getTrueTop(top) {
    let index = getIndexByTop(top);
    if (index < 0) {
      index = 0;
    }
    if (index > optionsLength - 1) {
      index = optionsLength - 1;
    }
    return getTopByIndex(index);
  }
  function mouseDown(e) {
    if (!editable) {
      return;
    }
    EventHandler('window', 'mousemove', mouseMove);
    EventHandler('window', 'mouseup', mouseUp);
    clearInterval(temp.interval);
    temp.moved = false;
    let client = GetClient(e);
    let y = client.y;
    setStyle({
      transition: 'unset'
    });
    let top = getTop();
    var index = getIndexByTop(top);
    setBoldStyle(index);
    setStyle({
      top,
      transition: 'unset'
    });
    onChange(options.optionsList[index].value, index);
    temp.so = {
      y,
      top,
      limit: getLimit()
    };
  }
  function getTop() {
    var top = parseInt($(temp.dom.current).find('.aio-input-list-options').css('top'));
    return getTrueTop(top);
  }
  function fixTop(value) {
    let {
      top,
      bottom
    } = temp.so.limit;
    if (value > top) {
      return top;
    }
    if (value < bottom) {
      return bottom;
    }
    return value;
  }
  function mouseMove(e) {
    temp.moved = true;
    var client = GetClient(e);
    let y = client.y;
    var offset = y - temp.so.y;
    if (temp.lastY === undefined) {
      temp.lastY = y;
    }
    temp.deltaY = y - temp.lastY;
    temp.lastY = y;
    if (Math.abs(offset) < 20) {
      temp.deltaY = 3;
    }
    var newTop = fixTop(temp.so.top + offset);
    let index = getIndexByTop(newTop);
    temp.so.newTop = newTop;
    setBoldStyle(index);
    setStyle({
      top: newTop
    });
  }
  function setStyle(obj) {
    $(temp.dom.current).find('.aio-input-list-options').css(obj);
  }
  function mouseUp() {
    EventHandler('window', 'mousemove', mouseMove, 'unbind');
    EventHandler('window', 'mouseup', mouseUp, 'unbind');
    if (!temp.moved) {
      return;
    }
    temp.moved = false;
    move(temp.deltaY, temp.so.newTop);
  }
  function move(deltaY, startTop = getTop()) {
    if (decay < 0) {
      decay = 0;
    }
    if (decay > 99) {
      decay = 99;
    }
    decay = 1 + decay / 1000;
    temp.interval = setInterval(() => {
      startTop += deltaY;
      let index = getIndexByTop(startTop);
      setBoldStyle(index);
      if (Math.abs(deltaY) < stop || index < 0 || index > optionsLength - 1) {
        clearInterval(temp.interval);
        if (index < 0) {
          index = 0;
        }
        if (index > optionsLength - 1) {
          index = optionsLength - 1;
        }
        let top = getTopByIndex(index);
        setStyle({
          top,
          transition: '0.3s'
        });
        const option = options.optionsList[index];
        onChange(option.value, option.details);
        return;
      }
      deltaY /= decay;
      setStyle({
        top: startTop
      });
    }, 20);
  }
  useEffect(() => {
    var _rootProps$listOption;
    if ((_rootProps$listOption = rootProps.listOptions) !== null && _rootProps$listOption !== void 0 && _rootProps$listOption.move) {
      rootProps.listOptions.move(move);
    }
  }, []);
  useEffect(() => {
    setBoldStyle(temp.activeIndex);
  });
  let fixedOptions = options.optionsList.map((o, i) => {
    if (o.value === rootProps.value) {
      temp.activeIndex = i;
    }
    return /*#__PURE__*/_jsx(Layout, {
      option: o,
      index: i,
      properties: {
        style: {
          height: size
        },
        justify: true
      }
    }, i);
  });
  return /*#__PURE__*/_jsx("div", {
    ...attrs,
    ref: temp.dom,
    tabIndex: 0,
    onKeyDown: e => keyDown(e),
    className: 'aio-input-list' + (attrs.className ? ' ' + attrs.className : ''),
    style: {
      ...attrs.style,
      ...getStyle()
    },
    children: /*#__PURE__*/_jsx("div", {
      className: "aio-input-list-options",
      style: getContainerStyle(),
      onMouseDown: e => mouseDown(e),
      onTouchStart: e => mouseDown(e),
      children: fixedOptions
    })
  });
}
const AcardionContext = /*#__PURE__*/createContext({});
export const Acardion = () => {
  const {
    rootProps,
    options
  } = useContext(AICTX);
  const {
    multiple,
    vertical = true,
    value
  } = rootProps;
  function isOpen(id) {
    if (!multiple) {
      return id === value;
    } else {
      return (value || []).indexOf(id) !== -1;
    }
  }
  function getContext() {
    let context = {
      rootProps,
      isOpen
    };
    return context;
  }
  return /*#__PURE__*/_jsx(AcardionContext.Provider, {
    value: getContext(),
    children: /*#__PURE__*/_jsx("div", {
      className: `aio-input-acardion aio-input-scroll${vertical ? ' aio-input-acardion-vertical' : ' aio-input-acardion-horizontal'}`,
      children: options.optionsList.map((option, i) => /*#__PURE__*/_jsx(AcardionItem, {
        option: option
      }, i))
    })
  });
};
const AcardionItem = ({
  option
}) => {
  let [mounted, SetMounted] = useState(false);
  const [active, setActive] = useState(!!option.details.active);
  let [timeout] = useState();
  let Attrs = AddToAttrs(option.attrs, {
    className: `aio-input-acardion-item`
  });
  function setMounted(mounted) {
    SetMounted(mounted);
  }
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (option.details.active) {
      setActive(true);
      setMounted(false);
      timeout = setTimeout(() => {
        setMounted(true);
      }, 10);
    } else {
      setActive(true);
      setMounted(false);
      timeout = setTimeout(() => {
        setActive(false);
      }, 300);
    }
  }, [!!option.details.active]);
  return /*#__PURE__*/_jsxs("div", {
    ...Attrs,
    children: [/*#__PURE__*/_jsx(Layout, {
      option: option
    }), !!active && /*#__PURE__*/_jsx(AcardionBody, {
      option: option,
      mounted: mounted
    })]
  });
};
const AcardionBody = ({
  option,
  mounted
}) => {
  const {
    rootProps
  } = useContext(AcardionContext);
  let {
    body = () => {}
  } = rootProps;
  let {
    html,
    attrs
  } = body(option.details.option) || {
    html: ''
  };
  let Attrs = AddToAttrs(attrs, {
    className: [`aio-input-acardion-body`, mounted ? undefined : 'not-mounted']
  });
  return /*#__PURE__*/_jsx("div", {
    ...Attrs,
    children: html
  });
};
const TreeContext = /*#__PURE__*/createContext({});
const Tree = () => {
  let {
    rootProps,
    types
  } = useContext(AICTX);
  let {
    onAdd,
    onRemove,
    value = [],
    onChange,
    size = Def('tree-size'),
    attrs
  } = rootProps;
  let [openDic, setOpenDic] = useState({});
  let [mountedDic, setMountedDic] = useState({});
  let [indent] = useState(getIndent);
  function SetMounted(id) {
    setMountedDic({
      ...mountedDic,
      [id]: !mountedDic[id]
    });
  }
  function SetOpen(id) {
    setOpenDic({
      ...openDic,
      [id]: !openDic[id]
    });
  }
  function getIndent() {
    let {
      indent = 24
    } = rootProps;
    if (typeof indent !== 'number') {
      indent = 12;
    }
    indent = Math.round(indent / 6) * 6;
    if (indent < 0) {
      indent = 0;
    }
    if (indent > 60) {
      indent = 60;
    }
    return indent;
  }
  function toggle(id) {
    let open = !!openDic[id],
      time = 300;
    if (!open) {
      SetOpen(id);
      setTimeout(() => SetMounted(id), 0);
    } else {
      SetMounted(id);
      setTimeout(() => SetOpen(id), time);
    }
  }
  useEffect(() => {
    if (rootProps.toggleRef) {
      rootProps.toggleRef.current = id => toggle(id);
    }
  }, [toggle]);
  useEffect(() => {
    if (rootProps.onToggle) {
      rootProps.onToggle(openDic);
    }
  }, [openDic]);
  function change(row, newRow) {
    for (let prop in newRow) {
      row[prop] = newRow[prop];
    }
    if (rootProps.onChange) {
      rootProps.onChange(rootProps.value);
    }
  }
  function getChilds(p) {
    let {
      row,
      details
    } = p;
    let childs = [];
    try {
      if (rootProps.getChilds) {
        childs = rootProps.getChilds({
          row,
          details
        });
      } else {
        childs = row.childs || [];
      }
    } catch {
      childs = [];
    }
    return childs || [];
  }
  function setChilds(p) {
    let {
      row,
      childs
    } = p;
    try {
      if (rootProps.setChilds) {
        rootProps.setChilds(p);
      } else {
        row.childs = childs;
      }
    } catch {}
  }
  async function add(p) {
    let newRow;
    if (typeof onAdd === 'function') {
      newRow = await onAdd(p);
    } else {
      newRow = onAdd;
    }
    if (!newRow) {
      return;
    }
    if (p) {
      let parentChilds = getChilds({
        row: p.parent,
        details: p.parentDetails
      });
      setChilds({
        row: p.parent,
        childs: parentChilds.concat(newRow),
        details: p.parentDetails
      });
    } else {
      value.push(newRow);
    }
    if (onChange) {
      onChange(value);
    }
  }
  async function remove(p) {
    let {
      index
    } = p;
    let res;
    if (typeof onRemove === 'function') {
      res = await onRemove(p);
    } else {
      res = true;
    }
    if (!res) {
      return;
    }
    const details = {
      index,
      active: false,
      toggle: () => {}
    };
    if (!p.parent) {
      value = value.filter(o => {
        let rowValue = GetOptionProps({
          key: 'value',
          rootProps,
          optionDetails: {
            ...details,
            option: p.row,
            rootProps
          }
        });
        let oValue = GetOptionProps({
          key: 'value',
          rootProps,
          optionDetails: {
            ...details,
            option: o,
            rootProps
          }
        });
        return rowValue !== oValue;
      });
    } else {
      let parentChilds = getChilds({
        row: p.parent,
        details: p.parentDetails
      });
      let newChilds = parentChilds.filter(o => {
        let rowValue = GetOptionProps({
          key: 'value',
          rootProps,
          optionDetails: {
            ...details,
            option: p.row,
            rootProps
          }
        });
        let oValue = GetOptionProps({
          key: 'value',
          rootProps,
          optionDetails: {
            ...details,
            option: o,
            rootProps
          }
        });
        return rowValue !== oValue;
      });
      setChilds({
        row: p.parent,
        details: p.parentDetails,
        childs: newChilds
      });
    }
    if (onChange) {
      onChange(value);
    }
  }
  function getContext() {
    return {
      toggle,
      rootProps,
      mountedDic,
      openDic,
      add,
      remove,
      types,
      indent,
      size,
      change,
      getChilds
    };
  }
  let Attrs = AddToAttrs(attrs, {
    className: ['aio-input-tree', rootProps.className],
    style: rootProps.style
  });
  return /*#__PURE__*/_jsx(TreeContext.Provider, {
    value: getContext(),
    children: /*#__PURE__*/_jsxs("div", {
      ...Attrs,
      children: [/*#__PURE__*/_jsx(TreeHeader, {}), /*#__PURE__*/_jsx(TreeBody, {
        rows: value,
        level: 0
      })]
    })
  });
};
const TreeHeader = () => {
  const {
    rootProps,
    add
  } = useContext(TreeContext);
  let {
    addText = 'add',
    onAdd
  } = rootProps;
  if (!onAdd) {
    return null;
  }
  addText = (typeof addText === 'function' ? addText('header') : addText) || 'add';
  return /*#__PURE__*/_jsx("div", {
    className: "aio-input-tree-header",
    children: /*#__PURE__*/_jsxs("button", {
      onClick: () => add(),
      children: [I('mdiPlusThick', .8), addText]
    })
  });
};
const TreeActions = props => {
  let {
    row,
    index,
    parent,
    rowDetails,
    parentDetails
  } = props;
  let {
    rootProps,
    add,
    remove
  } = useContext(TreeContext);
  let {
    onAdd,
    onRemove,
    removeText = 'Remove'
  } = rootProps;
  let addText = (typeof rootProps.addText === 'function' ? rootProps.addText(row) : rootProps.addText) || 'Add';
  let options = typeof rootProps.actions === 'function' ? rootProps.actions(row, parent) : rootProps.actions;
  function getOptions() {
    let res = [];
    if (onAdd) {
      res.push({
        text: addText,
        value: 'add',
        before: I('mdiPlusThick', 0.7),
        onClick: () => add({
          parent: row,
          parentDetails: rowDetails
        })
      });
    }
    let Options = (options || []).map(o => {
      return {
        ...o,
        onClick: () => {
          if (o.onClick) {
            o.onClick(row, parent);
          }
        }
      };
    });
    res = [...res, ...Options];
    if (onRemove) {
      res.push({
        text: removeText,
        value: 'remove',
        before: I('mdiDelete', 0.7),
        onClick: () => remove({
          row,
          index,
          parent,
          parentDetails
        })
      });
    }
    return res;
  }
  let Options = getOptions();
  if (!Options.length) {
    return null;
  }
  let p = {
    type: 'select',
    caret: false,
    popover: {
      limitTo: '.aio-input-tree'
    },
    className: 'aio-input-tree-options-button',
    options: Options,
    text: I('mdiDotsHorizontal', 0.7)
  };
  return /*#__PURE__*/_jsx(AIOInput, {
    ...p
  });
};
const TreeBody = props => {
  let {
    rootProps,
    types,
    openDic,
    mountedDic,
    indent,
    size,
    change,
    getChilds,
    toggle
  } = useContext(TreeContext);
  let {
    rows,
    level,
    parent,
    parentId,
    parentIndent,
    parentDetails
  } = props;
  let parentOpen = parentId === undefined ? true : !!openDic[parentId];
  let mounted = parentId == undefined ? true : mountedDic[parentId];
  let {
    onAdd,
    onRemove,
    actions
  } = rootProps;
  let {
    optionsList
  } = GetOptions({
    rootProps,
    types,
    options: rows,
    level,
    isOpen: id => !!openDic[id],
    change: (row, newRow) => change(row, newRow)
  });
  if (!!onAdd || !!onRemove || !!actions) {
    optionsList = optionsList.map(o => {
      let {
        index,
        level = 0,
        option
      } = o.details;
      let isFirstChild = index === 0;
      let isLastChild = index === rows.length - 1;
      let details = {
        index,
        level,
        isFirstChild,
        isLastChild
      };
      let after = /*#__PURE__*/_jsx(TreeActions, {
        row: option,
        index: index,
        parent: parent,
        rowDetails: details,
        parentDetails: parentDetails
      });
      return {
        ...o,
        after
      };
    });
  }
  function getClassName() {
    let className = 'aio-input-tree-body';
    if (!parent) {
      className += ' aio-input-tree-root';
    }
    if (parentOpen) {
      className += ' open';
    }
    className += !mounted ? ' not-mounted' : ' mounted';
    className += ` aio-input-tree-body-level-${level}`;
    return className;
  }
  return /*#__PURE__*/_jsx("div", {
    className: getClassName(),
    children: optionsList.map((option, index) => {
      let row = rows[index];
      let id = option.value;
      let details = {
        level,
        index,
        isLastChild: index === optionsList.length - 1,
        isFirstChild: index === 0
      };
      let childs = getChilds({
        row,
        details
      });
      let open = !!openDic[id];
      let item = {
        row,
        option,
        parent,
        parentId,
        id,
        parentOpen,
        open,
        details,
        indent: {
          height: size,
          childsLength: childs.length,
          size: indent,
          parentIndent,
          ...details
        }
      };
      let p = {
        className: `aio-input-tree-row`
      };
      return /*#__PURE__*/_createElement("div", {
        ...p,
        key: id
      }, /*#__PURE__*/_jsx(TreeRow, {
        item: item
      }), /*#__PURE__*/_jsx(TreeChilds, {
        item: item
      }));
    })
  });
};
const TreeRow = props => {
  let {
    openDic,
    getChilds,
    toggle
  } = useContext(TreeContext);
  let {
    item
  } = props;
  let childs = getChilds(item);
  let open = !childs.length ? undefined : !!openDic[item.id] ? true : false;
  let p = {
    indent: item.indent,
    option: item.option,
    toggle: {
      state: open,
      action: () => toggle(item.id)
    }
  };
  return /*#__PURE__*/_jsx(Layout, {
    ...p
  });
};
const TreeChilds = props => {
  let {
    getChilds
  } = useContext(TreeContext);
  let {
      row,
      id,
      open,
      indent,
      details
    } = props.item,
    childs = getChilds(props.item);
  if (!open || !childs || !childs.length) {
    return null;
  }
  return /*#__PURE__*/_jsx(TreeBody, {
    rows: childs,
    level: indent.level + 1,
    parent: row,
    parentId: id,
    parentIndent: indent,
    parentDetails: details
  });
};
const DPContext = /*#__PURE__*/createContext({});
export function Calendar(props) {
  let {
    rootProps,
    DATE
  } = useContext(AICTX);
  let {
    onClose
  } = props;
  let {
    multiple,
    unit = Def('date-unit'),
    jalali,
    value,
    disabled,
    size = 12,
    theme = Def('theme'),
    translate = text => text,
    onChange = () => {},
    option = {}
  } = rootProps;
  let [months] = useState(DATE.getMonths(jalali));
  let [today] = useState(DATE.getToday(jalali));
  let [todayWeekDay] = useState(DATE.getWeekDay(today).weekDay);
  let [thisMonthString] = useState(months[today[1] - 1]);
  let [activeDate, setActiveDate] = useState(getActiveDate);
  function getDate() {
    let date;
    if (multiple) {
      date = value.length ? value[value.length - 1] : undefined;
    } else {
      date = value;
    }
    return date;
  }
  function getActiveDate() {
    let date = getDate();
    date = !date || date === null ? today : date;
    let [year, month, day] = DATE.convertToArray(date);
    return {
      year,
      month,
      day
    };
  }
  let adRef = useRef(activeDate);
  adRef.current = activeDate;
  function trans(text) {
    if (text === 'Today') {
      if (unit === 'month') {
        text = 'This Month';
      } else if (unit === 'hour') {
        text = 'This Hour';
      }
    }
    let obj = {
      'Clear': 'حذف',
      'This Hour': 'ساعت کنونی',
      'Today': 'امروز',
      'This Month': 'ماه جاری',
      'Select Year': 'انتخاب سال',
      'Close': 'بستن'
    };
    let res;
    if (jalali && obj[text]) {
      res = obj[text];
    }
    return translate(text);
  }
  function changeActiveDate(obj) {
    let newActiveDate;
    if (obj === 'today') {
      let [year, month, day] = today;
      newActiveDate = {
        year,
        month,
        day: unit === 'month' ? 1 : day
      };
    } else {
      newActiveDate = {
        ...activeDate,
        ...obj
      };
    }
    setActiveDate(newActiveDate);
  }
  function getPopupStyle() {
    return {
      fontSize: size,
      background: theme[1],
      color: theme[0],
      stroke: theme[0],
      cursor: disabled === true ? 'not-allowed' : undefined
    };
  }
  function getSplitter() {
    let date = getDate();
    return typeof date === 'string' ? DATE.getSplitter(date) : '/';
  }
  function getContext() {
    let context = {
      changeActiveDate,
      DATE,
      translate: trans,
      rootProps,
      activeDate: adRef.current,
      today,
      todayWeekDay,
      thisMonthString,
      months,
      onChange: p => {
        let {
          year = 1000,
          month = 1,
          day = 1,
          hour = 0
        } = p;
        let dateArray = [year, month, day, hour];
        let jalaliDateArray = !jalali ? DATE.toJalali(dateArray) : dateArray;
        let gregorianDateArray = jalali ? DATE.toGregorian(dateArray) : dateArray;
        let {
          weekDay,
          index: weekDayIndex
        } = unit === 'month' ? {
          weekDay: '',
          index: 0
        } : DATE.getWeekDay(dateArray);
        let get2digit = v => {
          if (v === undefined) {
            return;
          }
          let vn = v.toString();
          return vn.length === 1 ? `0${vn}` : vn;
        };
        let dateString = '';
        let splitter = getSplitter();
        if (unit === 'month') {
          dateString = `${year}${splitter}${get2digit(month)}`;
        } else if (unit === 'day') {
          dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}`;
        } else if (unit === 'hour') {
          dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}${splitter}${get2digit(hour)}`;
        }
        let monthString = months[month - 1];
        let jalaliMonthString = !jalali ? DATE.getMonths(true)[month - 1] : monthString;
        let gregorianMonthString = jalali ? DATE.getMonths(false)[month - 1] : monthString;
        let props = {
          months,
          jalaliDateArray,
          gregorianDateArray,
          dateArray,
          weekDay,
          weekDayIndex,
          dateString,
          year,
          month,
          day,
          hour,
          monthString,
          jalaliMonthString,
          gregorianMonthString
        };
        let newValue,
          index = 0;
        if (multiple) {
          let current = [];
          if (value) {
            if (!Array.isArray(value)) {
              current = [value];
            } else {
              current = [...value];
            }
          } else {
            current = [];
          }
          let index = current.indexOf(dateString);
          if (index === -1) {
            newValue = [...current, dateString];
          } else {
            newValue = current.filter(o => o !== dateString);
          }
          if (typeof multiple === 'number') {
            while (newValue.length > multiple) {
              newValue = newValue.slice(1, newValue.length);
            }
          }
          index = newValue.length - 1;
        } else {
          index = 0;
          newValue = dateString;
        }
        onChange(newValue, props);
        if (onClose) {
          if (typeof option.close === 'function') {
            if (option.close({
              option: undefined,
              index,
              rootProps
            })) {
              onClose();
            }
          }
        }
      }
    };
    return context;
  }
  return /*#__PURE__*/_jsx(DPContext.Provider, {
    value: getContext(),
    children: /*#__PURE__*/_jsxs("div", {
      className: "aio-input-date-container",
      style: {
        display: 'flex',
        fontSize: size
      },
      children: [/*#__PURE__*/_jsxs("div", {
        className: "aio-input-date-calendar aio-input-theme-bg1 aio-input-theme-color0 aio-input-theme-stroke0",
        style: getPopupStyle(),
        children: [/*#__PURE__*/_jsx(DPHeader, {}), /*#__PURE__*/_jsx(DPBody, {}), /*#__PURE__*/_jsx(DPFooter, {})]
      }), /*#__PURE__*/_jsx(DPToday, {})]
    })
  });
}
function DPToday() {
  let {
    rootProps,
    translate,
    today,
    todayWeekDay,
    thisMonthString
  } = useContext(DPContext);
  let {
    theme = Def('theme'),
    jalali,
    unit = Def('date-unit')
  } = rootProps;
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-date-today aio-input-theme-color1 aio-input-theme-bg0",
    style: {
      color: theme[1],
      background: theme[0]
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: "aio-input-date-today-label",
      children: translate('Today')
    }), unit !== 'month' && /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-today-weekday",
      children: !jalali ? todayWeekDay.slice(0, 3) : todayWeekDay
    }), unit !== 'month' && /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-today-day",
      children: today[2]
    }), /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-today-month",
      children: !jalali ? thisMonthString.slice(0, 3) : thisMonthString
    }), /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-today-year",
      children: today[0]
    }), unit === 'hour' && /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-today-year",
      children: today[3] + ':00'
    })]
  });
}
function DPFooter() {
  let {
    rootProps,
    changeActiveDate,
    translate
  } = useContext(DPContext);
  let {
    disabled,
    onChange = () => {},
    deSelect,
    multiple,
    now = true
  } = rootProps;
  if (disabled) {
    return null;
  }
  const buttonClassName = 'aio-input-theme-color0';
  function clear() {
    if (typeof deSelect === 'function') {
      deSelect();
    } else {
      onChange(multiple ? [] : undefined);
    }
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-date-footer",
    children: [!!deSelect && /*#__PURE__*/_jsx("button", {
      onClick: () => clear(),
      className: buttonClassName,
      children: translate('Clear')
    }), !!now && /*#__PURE__*/_jsx("button", {
      onClick: () => changeActiveDate('today'),
      className: buttonClassName,
      children: translate('Today')
    })]
  });
}
function DPBody() {
  let {
    rootProps,
    activeDate
  } = useContext(DPContext);
  let {
    unit = Def('date-unit'),
    jalali
  } = rootProps;
  function getClassName() {
    let res = 'aio-input-date-body';
    res += ` aio-input-date-body-${unit}`;
    res += ` aio-input-date-${jalali ? 'rtl' : 'ltr'}`;
    //var columnCount = { hour: 4, day: 7, month: 3, year: 1 }[unit as AI_date_unit];
    //var rowCount = { hour: 6, day: 7, month: 4, year: 1 }[unit as AI_date_unit];
    return res;
  }
  return /*#__PURE__*/_jsxs("div", {
    className: getClassName(),
    children: [unit === 'hour' && GetArray(24, i => /*#__PURE__*/_jsx(DPCell, {
      dateArray: [activeDate.year, activeDate.month, activeDate.day, i]
    }, 'cell' + i)), unit === 'day' && /*#__PURE__*/_jsx(DPBodyDay, {}), unit === 'month' && GetArray(12, i => /*#__PURE__*/_jsx(DPCell, {
      dateArray: [activeDate.year, i + 1]
    }, 'cell' + i))]
  });
}
function DPBodyDay() {
  let {
    rootProps,
    activeDate,
    DATE
  } = useContext(DPContext);
  let {
    theme = Def('theme'),
    jalali
  } = rootProps;
  let firstDayWeekDayIndex = DATE.getWeekDay([activeDate.year, activeDate.month, 1]).index;
  let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
  let weekDays = DATE.getWeekDays(jalali);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [weekDays.map((weekDay, i) => /*#__PURE__*/_jsx(DPCellWeekday, {
      weekDay: weekDay
    }, 'weekday' + i)), GetArray(firstDayWeekDayIndex, i => /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-space aio-input-date-cell aio-input-theme-bg1",
      style: {
        background: theme[1]
      }
    }, 'space' + i)), GetArray(daysLength, i => /*#__PURE__*/_jsx(DPCell, {
      dateArray: [activeDate.year || 0, activeDate.month || 0, i + 1]
    }, 'cell' + i)), GetArray(42 - (firstDayWeekDayIndex + daysLength), i => /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-space aio-input-date-cell aio-input-theme-bg1",
      style: {
        background: theme[1]
      }
    }, 'endspace' + i))]
  });
}
const DPCellWeekday = props => {
  let {
    rootProps,
    translate
  } = useContext(DPContext);
  let {
    theme = Def('theme'),
    jalali
  } = rootProps;
  let {
    weekDay
  } = props;
  return /*#__PURE__*/_jsx("div", {
    className: "aio-input-date-weekday aio-input-date-cell aio-input-theme-bg1 aio-input-theme-color0",
    style: {
      background: theme[1],
      color: theme[0]
    },
    children: /*#__PURE__*/_jsx("span", {
      children: translate(weekDay.slice(0, !jalali ? 2 : 1))
    })
  });
};
function DPCell(props) {
  let {
    rootProps,
    translate,
    onChange,
    DATE
  } = useContext(DPContext);
  let {
    disabled,
    dateAttrs,
    theme = Def('theme'),
    value,
    jalali,
    unit = Def('date-unit'),
    multiple
  } = rootProps;
  let {
    dateArray
  } = props;
  function IsActive() {
    if (multiple) {
      return !value.length ? false : !!value.find(o => DATE.isEqual(dateArray, o));
    } else {
      return !value ? false : DATE.isEqual(dateArray, value);
    }
  }
  function getClassName(isActive, isToday, isDisabled, className) {
    var str = 'aio-input-date-cell';
    if (isDisabled) {
      str += ' aio-input-date-disabled';
    }
    if (isActive) {
      str += ' aio-input-date-active aio-input-theme-bg0 aio-input-theme-color1';
    } else {
      str += ' aio-input-theme-bg1 aio-input-theme-color0';
    }
    if (isToday) {
      str += ' today aio-input-theme-border0';
    }
    if (className) {
      str += ' className';
    }
    return str;
  }
  let isActive = IsActive();
  let isToday = DATE.isEqual(dateArray, DATE.getToday(jalali));
  let Attrs = {};
  if (dateAttrs) {
    Attrs = dateAttrs({
      dateArray,
      isToday,
      isActive,
      isMatch: o => DATE.isMatch(dateArray, o)
    });
    Attrs = Attrs || {};
  }
  let isDisabled = disabled === true || Attrs.disabled === true;
  let className = getClassName(isActive, isToday, isDisabled, Attrs.className);
  let onClick = isDisabled ? undefined : () => {
    onChange({
      year: dateArray[0],
      month: dateArray[1],
      day: dateArray[2],
      hour: dateArray[3]
    });
  };
  let style = {};
  if (!isDisabled) {
    style.background = theme[1];
  }
  if (className.indexOf('aio-input-date-active') !== -1) {
    style.background = theme[0];
    style.color = theme[1];
  }
  if (className.indexOf('today') !== -1) {
    style.border = `1px solid ${theme[0]}`;
  }
  style = {
    ...style,
    ...Attrs.style
  };
  let text;
  if (unit === 'hour') {
    text = dateArray[3] + ':00';
  } else if (unit === 'day') {
    text = dateArray[2];
  } else if (unit === 'month') {
    let months = DATE.getMonths(jalali);
    text = translate(!jalali ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1]);
  }
  return /*#__PURE__*/_jsx("div", {
    style: style,
    onClick: onClick,
    className: className,
    children: isDisabled ? /*#__PURE__*/_jsx("del", {
      children: text
    }) : text
  });
}
function DPHeaderItem(props) {
  let {
    unit
  } = props;
  let {
    rootProps,
    activeDate,
    months
  } = useContext(DPContext);
  let {
    theme = Def('theme'),
    jalali
  } = rootProps;
  if (!activeDate || !activeDate[unit]) {
    return null;
  }
  let text = unit === 'year' ? activeDate.year : months[activeDate[unit] - 1].substring(0, jalali ? 10 : 3);
  let p = {
    type: 'button',
    text,
    justify: true,
    caret: false,
    attrs: {
      className: 'aio-input-date-dropdown aio-input-theme-color0'
    },
    popover: {
      fitTo: '.aio-input-date-calendar',
      setAttrs: key => {
        if (key === 'modal') {
          return {
            style: {
              background: theme[1],
              color: theme[0]
            }
          };
        }
      },
      body: close => /*#__PURE__*/_jsx(DPHeaderPopup, {
        onClose: close,
        unit: unit
      })
    }
  };
  return /*#__PURE__*/_jsx(AIOInput, {
    ...p
  });
}
const DPHeaderPopup = props => {
  let {
    onClose,
    unit
  } = props;
  let {
    rootProps,
    DATE,
    translate,
    activeDate,
    changeActiveDate
  } = useContext(DPContext);
  let {
    jalali,
    theme = Def('theme')
  } = rootProps;
  let [months] = useState(DATE.getMonths(jalali));
  let [start, setStart] = useState(Math.floor(activeDate.year / 10) * 10);
  let [year, setYear] = useState(activeDate.year);
  let [month, setMonth] = useState(activeDate.month);
  useEffect(() => {
    setYear(activeDate.year);
    setMonth(activeDate.month);
  }, [activeDate.year, activeDate.month]);
  function changeValue(v) {
    if (unit === 'year') {
      setYear(v);
      changeActiveDate({
        year: v
      });
    } else {
      setMonth(v);
      changeActiveDate({
        month: v
      });
    }
    onClose();
  }
  function changePage(dir) {
    let newStart = start + dir * 10;
    setStart(newStart);
  }
  function getCells() {
    let cells = [];
    if (unit === 'year') {
      for (let i = start; i < start + 10; i++) {
        let active = i === year;
        let className = 'aio-input-date-cell';
        if (active) {
          className += ' aio-input-date-active aio-input-theme-bg0 aio-input-theme-color1';
        } else {
          className += ' aio-input-theme-bg1 aio-input-theme-color0';
        }
        let p = {
          style: active ? {
            background: theme[0],
            color: theme[1]
          } : {
            background: theme[1],
            color: theme[0]
          },
          className,
          onClick: () => changeValue(i)
        };
        cells.push( /*#__PURE__*/_createElement("div", {
          ...p,
          key: i
        }, i));
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        let active = i === month;
        let className = 'aio-input-date-cell';
        if (active) {
          className += ' aio-input-date-active aio-input-theme-bg0 aio-input-theme-color1';
        } else {
          className += ' aio-input-theme-bg1 aio-input-theme-color0';
        }
        let p = {
          style: active ? {
            background: theme[0],
            color: theme[1]
          } : {
            background: theme[1],
            color: theme[0]
          },
          className,
          onClick: () => changeValue(i)
        };
        cells.push( /*#__PURE__*/_createElement("div", {
          ...p,
          key: i
        }, months[i - 1].slice(0, 3)));
      }
    }
    return cells;
  }
  function header_node() {
    if (unit !== 'year') {
      return null;
    }
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-date-popup-header",
      children: [/*#__PURE__*/_jsx(DPArrow, {
        type: "minus",
        onClick: () => changePage(-1)
      }), /*#__PURE__*/_jsx("div", {
        className: "aio-input-date-popup-label",
        children: translate('Select Year')
      }), /*#__PURE__*/_jsx(DPArrow, {
        type: "plus",
        onClick: () => changePage(1)
      })]
    });
  }
  function body_node() {
    return /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-popup-body",
      children: getCells()
    });
  }
  function footer_node() {
    return /*#__PURE__*/_jsx("div", {
      className: "aio-input-date-popup-footer",
      children: /*#__PURE__*/_jsx("button", {
        className: "aio-input-theme-bg0 aio-input-theme-color0",
        onClick: () => onClose(),
        children: translate('Close')
      })
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: 'aio-input-date-popup' + (jalali ? ' aio-input-date-rtl' : ' aio-input-date-ltr'),
    children: [header_node(), body_node(), footer_node()]
  });
};
function DPHeader() {
  let {
    rootProps,
    activeDate,
    changeActiveDate,
    DATE
  } = useContext(DPContext);
  let {
    unit = Def('date-unit')
  } = rootProps;
  function getDays() {
    if (!activeDate || !activeDate.year || !activeDate.month) {
      return null;
    }
    let daysLength = DATE.getMonthDaysLength([activeDate.year, activeDate.month]);
    let options = GetArray(daysLength, i => ({
      text: (i + 1).toString(),
      value: i + 1
    }));
    let p = {
      value: activeDate.day,
      options,
      onChange: day => changeActiveDate({
        day
      })
    };
    return /*#__PURE__*/_jsx(DPHeaderDropdown, {
      ...p
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-date-header",
    children: [/*#__PURE__*/_jsx(DPArrow, {
      type: "minus"
    }), /*#__PURE__*/_jsxs("div", {
      className: "aio-input-date-select",
      children: [/*#__PURE__*/_jsx(DPHeaderItem, {
        unit: "year"
      }), unit !== 'month' ? /*#__PURE__*/_jsx(DPHeaderItem, {
        unit: "month"
      }) : null, unit === 'hour' ? getDays() : null]
    }), /*#__PURE__*/_jsx(DPArrow, {
      type: "plus"
    })]
  });
}
function DPHeaderDropdown(props) {
  let {
    rootProps
  } = useContext(DPContext);
  let {
    value,
    options,
    onChange
  } = props;
  let {
    theme = Def('theme')
  } = rootProps;
  let p = {
    value,
    options,
    onChange,
    caret: false,
    type: 'select',
    attrs: {
      className: 'aio-input-date-dropdown aio-input-theme-bg1 aio-input-theme-color0'
    },
    option: {
      style: () => {
        return {
          background: theme[1],
          color: theme[0]
        };
      }
    }
  };
  return /*#__PURE__*/_jsx(AIOInput, {
    ...p
  });
}
function DPArrow(props) {
  let {
    rootProps,
    changeActiveDate,
    activeDate,
    DATE
  } = useContext(DPContext);
  let {
    type,
    onClick
  } = props;
  let {
    jalali,
    unit = Def('date-unit'),
    theme = Def('theme')
  } = rootProps;
  function change() {
    if (onClick) {
      onClick();
      return;
    }
    let offset = (!jalali ? 1 : -1) * (type === 'minus' ? -1 : 1);
    let date = [activeDate.year, activeDate.month, activeDate.day];
    if (unit === 'month') {
      changeActiveDate({
        year: activeDate.year + offset
      });
    }
    if (unit === 'day') {
      let newDate = [];
      if (date[1] === 1 && offset === -1) {
        newDate = [date[0] - 1, 12];
      } else if (date[1] === 12 && offset === 1) {
        newDate = [date[0] + 1, 1];
      } else {
        newDate = [date[0], date[1] + offset];
      }
      changeActiveDate({
        year: newDate[0],
        month: newDate[1]
      });
    }
    if (unit === 'hour') {
      let next = DATE.getNextTime(date, offset * 24 * 60 * 60 * 1000, jalali);
      changeActiveDate({
        year: next[0],
        month: next[1],
        day: next[2]
      });
    }
  }
  function getIcon() {
    return I(type === 'minus' ? 'mdiChevronLeft' : 'mdiChevronRight', 1, {
      color: theme[0],
      className: 'aio-input-theme-color0'
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "aio-input-date-arrow",
    onClick: () => change(),
    children: getIcon()
  });
}
const AITableContext = /*#__PURE__*/createContext({});
function Table() {
  let {
    rootProps,
    DATE
  } = useContext(AICTX);
  let {
    paging,
    getValue = {},
    value,
    onChange = () => {},
    onAdd,
    onRemove,
    excel,
    onSwap,
    onSearch,
    rowAttrs,
    onChangeSort,
    className,
    style
  } = rootProps;
  let [dom] = useState( /*#__PURE__*/createRef());
  let [searchValue, setSearchValue] = useState('');
  let [columns, setColumns] = useState([]);
  let [searchColumns, setSearchColumns] = useState([]);
  let [excelColumns, setExcelColumns] = useState([]);
  let [temp] = useState({});
  let [DragRows] = useState(!onSwap ? false : new DragClass({
    callback: (dragData, dropData) => {
      if (DragRows === false) {
        return;
      }
      const {
        dragIndex
      } = dragData;
      const {
        dropIndex,
        rows
      } = dropData;
      const newRows = DragRows.reOrder(rows, dragIndex, dropIndex);
      const from = rows[dragIndex];
      const to = rows[dropIndex];
      if (typeof onSwap === 'function') {
        onSwap(newRows, from, to);
      } else {
        onChange(newRows);
      }
    }
  }));
  let [sorts, setSorts] = useState([]);
  function getColumns() {
    let {
      columns = []
    } = rootProps;
    columns = typeof columns === 'function' ? columns() : columns;
    let searchColumns = [],
      excelColumns = [];
    let updatedColumns = columns.map(o => {
      let {
        id = 'aitc' + Math.round(Math.random() * 1000000),
        sort,
        search,
        excel
      } = o;
      let column = {
        ...o,
        _id: id
      };
      if (search) {
        searchColumns.push(column);
      }
      if (excel) {
        excelColumns.push(column);
      }
      return column;
    });
    setColumns(updatedColumns);
    setSearchColumns(searchColumns);
    setExcelColumns(excelColumns);
    return updatedColumns;
  }
  function getSorts(columns) {
    let sorts = [];
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      let {
        _id,
        input
      } = column;
      let sort = column.sort === true ? {} : column.sort;
      if (!sort) {
        continue;
      }
      let {
        active = false,
        dir = 'dec'
      } = sort;
      let getValue;
      if (sort.getValue) {
        getValue = sort.getValue;
      } else {
        getValue = row => {
          let value = getDynamics({
            value: column.value,
            row,
            column
          });
          if (input && input.type === 'date') {
            value = DATE.getTime(value);
          }
          return value;
        };
      }
      let type;
      if (input && ['number', 'date', 'range'].indexOf(input.type) !== -1) {
        type = 'number';
      } else {
        type = sort.type || 'string';
      }
      let sortItem = {
        dir,
        title: sort.title || column.title,
        sortId: _id,
        active,
        type,
        getValue
      };
      sorts.push(sortItem);
    }
    setSorts(sorts);
  }
  function getDynamics(p) {
    let {
      value,
      row,
      column,
      def,
      rowIndex
    } = p;
    if (paging) {
      let {
        number,
        size
      } = paging;
      if (rowIndex) rowIndex += (number - 1) * size;
    }
    let type = typeof value;
    if (type === 'string') {
      let result = value;
      let param = {
        row,
        column: column,
        rowIndex: rowIndex
      };
      if (getValue[value]) {
        result = getValue[value](param);
      } else if (value.indexOf('row.') !== -1) {
        try {
          eval(`result = ${value}`);
        } catch {
          result = '';
        }
      }
      return result === undefined ? def : result;
    }
    if (type === 'undefined') {
      return def;
    }
    if (type === 'function') {
      return value({
        row,
        column,
        rowIndex
      });
    }
    return value === undefined ? def : value;
  }
  useEffect(() => {
    let columns = getColumns();
    getSorts(columns);
  }, []);
  function add() {
    typeof onAdd === 'function' ? onAdd() : onChange([{
      ...onAdd
    }, ...value]);
  }
  function remove(row, index) {
    let action = () => onChange(value.filter(o => o._id !== row._id));
    typeof onRemove === 'function' ? onRemove({
      row,
      action,
      rowIndex: index
    }) : action();
  }
  function exportToExcel() {
    let list = [];
    if (typeof rootProps.excel === 'function') {
      list = rootProps.excel(value);
    } else {
      for (let i = 0; i < value.length; i++) {
        let row = value[i],
          json = {};
        for (let j = 0; j < excelColumns.length; j++) {
          let column = excelColumns[j],
            {
              excel,
              value
            } = column;
          let key = '';
          if (excel === true) {
            if (typeof column.title === 'string') {
              key = column.title;
            } else {
              key = 'untitle';
            }
          } else if (typeof excel === 'string') {
            key = excel;
          } else {
            continue;
          }
          json[key] = getDynamics({
            value,
            row,
            column,
            rowIndex: i
          });
        }
        list.push(json);
      }
    }
    ExportToExcel(list, {
      promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name'
    });
  }
  function getSearchedRows(rows) {
    if (onSearch !== true) {
      return rows;
    }
    if (!searchColumns.length || !searchValue) {
      return rows;
    }
    return AIOInputSearch(rows, searchValue, (row, index) => {
      let str = '';
      for (let i = 0; i < searchColumns.length; i++) {
        let column = searchColumns[i];
        let value = getDynamics({
          value: column.value,
          row,
          def: '',
          column,
          rowIndex: index
        });
        if (value) {
          str += value + ' ';
        }
      }
      return str;
    });
  }
  function sortRows(rows, sorts) {
    if (!rows) {
      return [];
    }
    if (!sorts || !sorts.length) {
      return rows;
    }
    return rows.sort((a, b) => {
      for (let i = 0; i < sorts.length; i++) {
        let {
          dir,
          getValue
        } = sorts[i];
        if (!getValue) {
          return 0;
        }
        let aValue = getValue(a),
          bValue = getValue(b);
        if (aValue < bValue) {
          return -1 * (dir === 'dec' ? -1 : 1);
        }
        if (aValue > bValue) {
          return 1 * (dir === 'dec' ? -1 : 1);
        }
        if (i === sorts.length - 1) {
          return 0;
        }
      }
      return 0;
    });
  }
  function getSortedRows(rows) {
    if (temp.isInitSortExecuted) {
      return rows;
    }
    if (onChangeSort) {
      return rows;
    }
    let activeSorts = sorts.filter(sort => sort.active !== false);
    if (!activeSorts.length || !rows.length) {
      return rows;
    }
    temp.isInitSortExecuted = true;
    let sortedRows = sortRows(rows, activeSorts);
    onChange(sortedRows);
    return sortedRows;
  }
  function getRows() {
    let searchedRows = getSearchedRows(value);
    let sortedRows = getSortedRows(searchedRows);
    let pagedRows = paging && !paging.serverSide ? sortedRows.slice((paging.number - 1) * paging.size, paging.number * paging.size) : sortedRows;
    return {
      rows: value,
      searchedRows,
      sortedRows,
      pagedRows
    };
  }
  //calculate style of cells and title cells
  function getCellStyle(column) {
    let width = getDynamics({
      value: column.width
    });
    let minWidth = getDynamics({
      value: column.minWidth
    });
    return {
      width: width ? width : undefined,
      flex: width ? undefined : 1,
      minWidth
    };
  }
  function getCellAttrs(p) {
    let {
      row,
      rowIndex,
      column,
      type
    } = p;
    let {
      cellAttrs,
      titleAttrs
    } = column;
    let attrs = getDynamics({
      value: type === 'title' ? titleAttrs : cellAttrs,
      column,
      def: {},
      row,
      rowIndex
    });
    let justify = getDynamics({
      value: column.justify,
      def: false
    });
    let cls = `aio-input-table-${type}` + (justify ? ` aio-input-table-${type}-justify` : '');
    attrs = AddToAttrs(attrs, {
      className: cls,
      style: getCellStyle(column)
    });
    if (type === 'title') {
      attrs.title = getDynamics({
        value: column.title,
        def: ''
      });
    }
    return {
      ...attrs
    };
  }
  function getRowAttrs(row, rowIndex) {
    let attrs = rowAttrs ? rowAttrs({
      row,
      rowIndex
    }) : {};
    let obj = AddToAttrs(attrs, {
      className: 'aio-input-table-row'
    });
    if (DragRows !== false) {
      obj = {
        ...obj,
        ...DragRows.getDragAttrs({
          dragIndex: rowIndex
        }),
        ...DragRows.getDropAttrs({
          dropIndex: rowIndex,
          rows: value
        })
      };
    }
    return obj;
  }
  function search(searchValue) {
    if (onSearch === true) {
      setSearchValue(searchValue);
    } else if (typeof onSearch === 'function') {
      onSearch(searchValue);
    }
  }
  function getContext(ROWS) {
    let context = {
      ROWS,
      rootProps,
      columns,
      sorts,
      setSorts,
      sortRows,
      excelColumns,
      getCellAttrs,
      getRowAttrs,
      add,
      remove,
      search,
      exportToExcel,
      getDynamics
    };
    return context;
  }
  let ROWS = getRows();
  let attrs = AddToAttrs(rootProps.attrs, {
    className: ['aio-input aio-input-table', className],
    style: rootProps.style,
    attrs: {
      ref: dom
    }
  });
  return /*#__PURE__*/_jsx(AITableContext.Provider, {
    value: getContext(ROWS),
    children: /*#__PURE__*/_jsxs("div", {
      ...attrs,
      children: [/*#__PURE__*/_jsx(TableToolbar, {}), /*#__PURE__*/_jsxs("div", {
        className: "aio-input-table-unit aio-input-scroll",
        children: [/*#__PURE__*/_jsx(TableHeader, {}), /*#__PURE__*/_jsx(TableRows, {})]
      }), paging ? /*#__PURE__*/_jsx(TablePaging, {}) : '']
    })
  });
}
function TableGap(props) {
  let {
    rootProps
  } = useContext(AITableContext);
  let {
    rowGap,
    columnGap
  } = rootProps;
  let {
    dir
  } = props;
  let style;
  if (dir === 'h') {
    style = {
      height: rowGap
    };
  } else {
    style = {
      width: columnGap
    };
  }
  return /*#__PURE__*/_jsx("div", {
    className: `aio-input-table-border-${dir}`,
    style: style
  });
}
function TablePaging() {
  let {
    ROWS,
    rootProps
  } = useContext(AITableContext);
  let [temp] = useState({
    timeout: undefined,
    start: undefined,
    end: undefined,
    pages: 0
  });
  function fix(paging) {
    if (typeof rootProps.onChangePaging !== 'function') {
      alert('aio-input error => in type table you set paging but forget to set onChangePaging function prop to aio input');
      return {
        number: 0,
        size: 0
      };
    }
    let {
      number,
      size = 20,
      length = 0,
      sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100],
      serverSide
    } = paging;
    if (!serverSide) {
      length = ROWS.sortedRows.length;
    }
    if (sizes.indexOf(size) === -1) {
      size = sizes[0];
    }
    let pages = Math.ceil(length / size);
    number = number > pages ? pages : number;
    number = number < 1 ? 1 : number;
    let start = number - 3,
      end = number + 3;
    temp.start = start;
    temp.end = end;
    temp.pages = pages;
    return {
      ...paging,
      length,
      number,
      size,
      sizes
    };
  }
  let [paging, setPaging] = useState(fix(rootProps.paging || {
    size: 0,
    number: 0
  }));
  useEffect(() => {
    if (rootProps.paging) {
      setPaging(fix(rootProps.paging));
    }
  }, [(rootProps.paging || {
    size: 0,
    number: 0,
    length: 0
  }).size, (rootProps.paging || {
    size: 0,
    number: 0,
    length: 0
  }).number, (rootProps.paging || {
    size: 0,
    number: 0,
    length: 0
  }).length]);
  function changePaging(obj) {
    let newPaging = fix({
      ...paging,
      ...obj
    });
    setPaging(newPaging);
    if (rootProps.onChangePaging) {
      if (newPaging.serverSide) {
        clearTimeout(temp.timeout);
        temp.timeout = setTimeout(() => {
          //be khatere fahme payine typescript majbooram dobare in shart ro bezanam
          if (rootProps.onChangePaging) {
            rootProps.onChangePaging(newPaging);
          }
        }, 800);
      } else {
        rootProps.onChangePaging(newPaging);
      }
    }
  }
  let {
    number,
    size,
    sizes
  } = paging;
  let buttons = [];
  let isFirst = true;
  for (let i = temp.start; i <= temp.end; i++) {
    if (i < 1 || i > temp.pages) {
      buttons.push( /*#__PURE__*/_jsx("button", {
        className: 'aio-input-table-paging-button aio-input-table-paging-button-hidden',
        children: i
      }, i));
    } else {
      let index;
      if (isFirst) {
        index = 1;
        isFirst = false;
      } else if (i === Math.min(temp.end, temp.pages)) {
        index = temp.pages;
      } else {
        index = i;
      }
      buttons.push( /*#__PURE__*/_jsx("button", {
        className: 'aio-input-table-paging-button' + (index === number ? ' active' : ''),
        onClick: () => changePaging({
          number: index
        }),
        children: index
      }, index));
    }
  }
  function changeSizeButton() {
    if (!sizes || !sizes.length) {
      return null;
    }
    let p = {
      attrs: {
        className: 'aio-input-table-paging-button aio-input-table-paging-size'
      },
      type: 'select',
      value: size,
      options: sizes,
      option: {
        text: 'option',
        value: 'option'
      },
      onChange: value => changePaging({
        size: value
      }),
      popover: {
        fitHorizontal: true
      }
    };
    return /*#__PURE__*/_jsx(AIOInput, {
      ...p
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-table-paging",
    children: [buttons, changeSizeButton()]
  });
}
function TableRows() {
  let {
    ROWS,
    rootProps
  } = useContext(AITableContext);
  let {
    rowTemplate,
    rowAfter = () => null,
    rowBefore = () => null,
    rowsTemplate,
    placeholder = 'there is not any items'
  } = rootProps;
  let rows = ROWS.pagedRows || [];
  let content;
  if (rowsTemplate) {
    content = rowsTemplate(rows);
  } else if (rows.length) {
    content = rows.map((o, i) => {
      let {
        id = 'ailr' + Math.round(Math.random() * 10000000)
      } = o;
      o._id = o._id === undefined ? id : o._id;
      let isLast = i === rows.length - 1,
        Row;
      if (rowTemplate) {
        Row = rowTemplate({
          row: o,
          rowIndex: i,
          isLast
        });
      } else {
        Row = /*#__PURE__*/_jsx(TableRow, {
          row: o,
          rowIndex: i,
          isLast: isLast
        }, o._id);
      }
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [rowBefore({
          row: o,
          rowIndex: i
        }), Row, rowAfter({
          row: o,
          rowIndex: i
        })]
      }, o._id);
    });
  } else if (placeholder) {
    content = /*#__PURE__*/_jsx("div", {
      style: {
        width: '100%',
        textAlign: 'center',
        padding: 12,
        boxSizing: 'border-box'
      },
      children: placeholder
    });
  } else {
    return null;
  }
  return /*#__PURE__*/_jsx("div", {
    className: "aio-input-table-rows",
    children: content
  });
}
function TableToolbar() {
  let {
    add,
    exportToExcel,
    sorts,
    sortRows,
    setSorts,
    search,
    rootProps,
    excelColumns
  } = useContext(AITableContext);
  let {
    toolbarAttrs,
    toolbar,
    onAdd,
    onSearch,
    onChangeSort,
    onChange = () => {},
    value,
    addText
  } = rootProps;
  toolbarAttrs = AddToAttrs(toolbarAttrs, {
    className: 'aio-input-table-toolbar'
  });
  if (!onAdd && !toolbar && !onSearch && !sorts.length && !excelColumns.length) {
    return null;
  }
  function changeSort(sortId, changeObject) {
    let newSorts = sorts.map(sort => {
      if (sort.sortId === sortId) {
        let newSort = {
          ...sort,
          ...changeObject
        };
        return newSort;
      }
      return sort;
    });
    changeSorts(newSorts);
  }
  async function changeSorts(sorts) {
    if (onChangeSort) {
      let res = await onChangeSort(sorts);
      if (res !== false) {
        setSorts(sorts);
      }
    } else {
      setSorts(sorts);
      let activeSorts = sorts.filter(sort => sort.active !== false);
      if (activeSorts.length) {
        onChange(sortRows(value, activeSorts));
      }
    }
  }
  function button() {
    if (!sorts.length) {
      return null;
    }
    let p = {
      popover: {
        header: {
          attrs: {
            className: 'aio-input-table-toolbar-popover-header'
          },
          title: 'Sort',
          onClose: false
        },
        pageSelector: '.aio-input-table'
      },
      caret: false,
      type: 'select',
      options: sorts,
      option: {
        text: 'option.title',
        checked: '!!option.active',
        close: () => false,
        value: 'option.sortId',
        after: ({
          option
        }) => {
          let {
            dir = 'dec',
            sortId
          } = option;
          return /*#__PURE__*/_jsx("div", {
            onClick: e => {
              e.stopPropagation();
              changeSort(sortId, {
                dir: dir === 'dec' ? 'inc' : 'dec'
              });
            },
            children: I(dir === 'dec' ? 'mdiArrowDown' : 'mdiArrowUp', 0.8)
          });
        }
      },
      attrs: {
        className: 'aio-input-table-toolbar-button'
      },
      text: I('mdiSort', 0.7),
      onSwap: (newSorts, from, to) => changeSorts(newSorts),
      onChange: (value, option) => changeSort(value, {
        active: !option.checked
      })
    };
    return /*#__PURE__*/_createElement(AIOInput, {
      ...p,
      key: "sortbutton"
    });
  }
  function getAddText() {
    let {
      addText
    } = rootProps;
    if (!rootProps.addText) {
      return I('mdiPlusThick', 0.8);
    }
    if (typeof addText === 'function') {
      return addText(value);
    }
    return addText;
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs("div", {
      ...toolbarAttrs,
      children: [toolbar && /*#__PURE__*/_jsx("div", {
        className: "aio-input-table-toolbar-content",
        children: typeof toolbar === 'function' ? toolbar() : toolbar
      }), /*#__PURE__*/_jsx("div", {
        className: "aio-input-table-search",
        children: !!onSearch && /*#__PURE__*/_jsx(AIOInput, {
          type: "text",
          onChange: value => search(value),
          after: I('mdiMagnify', 0.7)
        })
      }), button(), !!excelColumns.length && /*#__PURE__*/_jsx("div", {
        className: "aio-input-table-toolbar-button",
        onClick: () => exportToExcel(),
        children: I('mdiFileExcel', 0.8)
      }), !!onAdd && /*#__PURE__*/_jsx("div", {
        className: "aio-input-table-toolbar-button",
        onClick: () => add(),
        children: getAddText()
      })]
    }), /*#__PURE__*/_jsx(TableGap, {
      dir: "h"
    })]
  });
}
function TableHeader() {
  let {
    rootProps,
    columns
  } = useContext(AITableContext);
  let {
    headerAttrs,
    onRemove
  } = rootProps;
  headerAttrs = AddToAttrs(headerAttrs, {
    className: 'aio-input-table-header'
  });
  let Titles = columns.map((o, i) => /*#__PURE__*/_jsx(TableTitle, {
    column: o,
    isLast: i === columns.length - 1
  }, o._id));
  let RemoveTitle = !onRemove ? null : /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(TableGap, {
      dir: "v"
    }), /*#__PURE__*/_jsx("div", {
      className: "aio-input-table-remove-title"
    })]
  });
  return /*#__PURE__*/_jsxs("div", {
    ...headerAttrs,
    children: [Titles, RemoveTitle, /*#__PURE__*/_jsx(TableGap, {
      dir: "h"
    })]
  });
}
function TableTitle(p) {
  let {
    column,
    isLast
  } = p;
  let {
    getCellAttrs
  } = useContext(AITableContext);
  let attrs = getCellAttrs({
    column,
    type: 'title'
  });
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      ...attrs,
      children: attrs.title
    }), !isLast && /*#__PURE__*/_jsx(TableGap, {
      dir: "v"
    })]
  });
}
function TableRow(p) {
  let {
    row,
    isLast,
    rowIndex
  } = p;
  let {
    remove,
    rootProps,
    columns,
    getRowAttrs
  } = useContext(AITableContext);
  function getCells() {
    return columns.map((column, i) => {
      let key = row._id + ' ' + column._id;
      let isLast = i === columns.length - 1;
      return /*#__PURE__*/_jsx(TableCell, {
        isLast: isLast,
        row: row,
        rowIndex: rowIndex,
        column: column
      }, key);
    });
  }
  let {
    onRemove
  } = rootProps;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs("div", {
      ...getRowAttrs(row, rowIndex),
      children: [getCells(), onRemove ? /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(TableGap, {
          dir: "v"
        }), /*#__PURE__*/_jsx("button", {
          className: "aio-input-table-remove",
          onClick: () => remove(row, rowIndex),
          children: I('mdiClose', 0.8)
        })]
      }) : null]
    }, row._id), /*#__PURE__*/_jsx(TableGap, {
      dir: "h"
    })]
  });
}
const TableCell = p => {
  let {
    row,
    rowIndex,
    column,
    isLast
  } = p;
  let {
    getCellAttrs,
    rootProps,
    getDynamics
  } = useContext(AITableContext);
  let {
    onChange = () => {},
    value = []
  } = rootProps;
  function setCell(row, column, cellNewValue) {
    if (column.input && column.input.onChange) {
      column.input.onChange({
        value: cellNewValue,
        row,
        column
      });
    } else {
      row = JSON.parse(JSON.stringify(row));
      eval(`${column.value} = cellNewValue`);
      onChange(value.map(o => o._id !== row._id ? o : row));
    }
  }
  let contentProps = {
    row,
    rowIndex,
    column,
    onChange: column.input ? value => setCell(row, column, value) : undefined
  };
  let key = row._id + ' ' + column._id;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      ...getCellAttrs({
        row,
        rowIndex,
        column,
        type: 'cell'
      }),
      children: /*#__PURE__*/_createElement(TableCellContent, {
        ...contentProps,
        key: key
      })
    }), !isLast && /*#__PURE__*/_jsx(TableGap, {
      dir: "v"
    })]
  }, key);
};
function TableCellContent(props) {
  let {
    row,
    column,
    rowIndex,
    onChange
  } = props;
  let {
    getDynamics
  } = useContext(AITableContext);
  let template = getDynamics({
    value: column.template,
    row,
    rowIndex,
    column
  });
  if (template !== undefined) {
    return template;
  }
  let input = getDynamics({
    value: column.input,
    row,
    rowIndex,
    column
  });
  let value = getDynamics({
    value: column.value,
    row,
    rowIndex,
    column
  });
  if (!input) {
    return value;
  }
  //justify baraye input ast amma agar rooye column set shode va input set nashode be input bede
  input.justify = input.justify || getDynamics({
    value: column.justify,
    row,
    rowIndex,
    column
  });
  let convertedInput = {
    type: 'text'
  };
  for (let property in input) {
    let prop = property;
    let res = input[prop];
    if (['onChange', 'onClick'].indexOf(prop) !== -1) {
      convertedInput[prop] = res;
    } else {
      convertedInput[prop] = getDynamics({
        value: res,
        row,
        rowIndex,
        column
      });
    }
  }
  let p = {
    ...convertedInput,
    value,
    onChange,
    type: input.type
  };
  return /*#__PURE__*/_createElement(AIOInput, {
    ...p,
    key: row._id + ' ' + column._id
  });
}
function AIOInputSearch(items, searchValue, getValue) {
  if (!searchValue) {
    return items;
  }
  function isMatch(keys, value) {
    for (let i = 0; i < keys.length; i++) {
      if (value.indexOf(keys[i]) === -1) {
        return false;
      }
    }
    return true;
  }
  let keys = searchValue.split(' ');
  return items.filter((o, i) => isMatch(keys, getValue ? getValue(o, i) : o));
}
const RangeContext = /*#__PURE__*/createContext({});
const Range = () => {
  let {
    rootProps
  } = useContext(AICTX);
  let {
    start = 0,
    end = 360,
    min = start,
    max = end,
    step = 1,
    reverse,
    round,
    vertical,
    multiple,
    text,
    onChange,
    size = Def('range-size'),
    disabled,
    className,
    labels = [],
    rotate = 0
  } = rootProps;
  let [temp] = useState({
    dom: /*#__PURE__*/createRef(),
    start: 0,
    index: false
  });
  function getValidValue(value) {
    if (!Array.isArray(value)) {
      value = [value || 0];
    }
    for (let i = 0; i < value.length; i++) {
      let point = value[i] || 0;
      point = Math.round((point - start) / step) * step + start;
      point = +point.toFixed(GetPrecisionCount(step));
      if (point < min) {
        point = min;
      }
      if (point > max) {
        point = max;
      }
      value[i] = point;
    }
    return value;
  }
  let value = getValidValue(rootProps.value);
  let valueRef = useRef(value);
  valueRef.current = value;
  let [disabledDic, setDisabledDic] = useState(getDisabledDic());
  function getDisabledDic() {
    if (!Array.isArray(disabled)) {
      return {};
    }
    let res = {};
    for (let i = 0; i < disabled.length; i++) {
      let key = 'a' + disabled[i];
      res[key] = true;
    }
    return res;
  }
  useEffect(() => {
    setDisabledDic(getDisabledDic());
  }, [JSON.stringify(disabled)]);
  useEffect(() => {
    if (!onChange) {
      return;
    }
    clearTimeout(temp.timeOut);
    temp.timeOut = setTimeout(() => {
      new Swip({
        reverseX: !!reverse,
        //vertical condition
        reverseY: !!reverse && !!vertical,
        dom: () => $(temp.dom.current),
        start: p => {
          let {
            event
          } = p;
          if (event.target !== null) {
            let target = $(event.target);
            if (HasClass(target, 'ai-range-point')) {
              let index = target.attr('data-index') || '0';
              temp.index = +index;
            } else {
              temp.index = false;
            }
            temp.start = [...valueRef.current];
          }
          return [0, 0];
        },
        move: p => {
          let {
            change,
            mousePosition
          } = p;
          if (change) {
            changeHandle({
              dx: change.dx,
              dy: change.dy,
              deltaCenterAngle: change.deltaCenterAngle,
              centerAngle: mousePosition.centerAngle
            });
          }
        },
        onClick: function (p) {
          click(p.mousePosition);
        }
      });
    }, 100);
  }, [changeHandle]);
  function getDefaultOffset(type) {
    if (type === 'point') {
      return round ? 100 : 0;
    }
    if (type === 'label') {
      return round ? 116 : 14;
    }
    if (type === 'scale') {
      return round ? 100 : 14;
    }
    return 0;
  }
  function changeValue(newValue) {
    if (!onChange) {
      return;
    }
    newValue = getValidValue(newValue);
    onChange(!!multiple ? newValue : newValue[0]);
  }
  function click(mousePosition) {
    if (disabled === true || temp.index !== false) {
      return;
    }
    let value = valueRef.current;
    let clickedValue;
    //vertical condition
    if (round) {
      clickedValue = getValueByAngle(mousePosition.centerAngle);
    } else {
      clickedValue = getValueByXP(mousePosition[vertical ? 'yp' : 'xp']);
    }
    if (clickedValue < value[value.length - 1] && clickedValue > value[0]) {
      return;
    }
    if (clickedValue < value[0]) {
      change1Unit(-1);
    } else {
      change1Unit(1);
    }
  }
  function isValueValid(value) {
    for (let i = 0; i < value.length; i++) {
      if (isValueDisabled(value[i])) {
        return false;
      }
    }
    return true;
  }
  const sbp = (value, p = {}) => {
    let {
      half = false,
      range = size / (half ? 2 : 1)
    } = p;
    let res = range * value / 100;
    let {
      min,
      max
    } = p;
    if (min !== undefined && res < min) {
      res = min;
    }
    if (max !== undefined && res > max) {
      res = max;
    }
    return res;
  };
  const getCircleByStr = (str, type) => {
    let [ticknessStr, offsetStr, colorStr, roundCapStr, fullStr] = str.split(' ');
    let thickness = 1,
      radius = 0,
      roundCap = false,
      color = '#000',
      full = true;
    try {
      let thicknessValue = +ticknessStr;
      if (isNaN(thicknessValue)) {
        thicknessValue = 1;
      }
      thickness = thicknessValue;
      let offsetValue = +offsetStr;
      if (isNaN(offsetValue)) {
        offsetValue = 0;
      }
      let defaultRadius = size / 2 - thickness / 2;
      if (type === 'offset') {
        radius = defaultRadius - offsetValue;
      } else {
        radius = offsetValue;
      }
      if (radius > defaultRadius) {
        radius = defaultRadius;
      }
      if (radius < thickness / 2) {
        radius = thickness / 2;
      }
      if (roundCapStr === '1') {
        roundCap = true;
      } else {
        roundCap = false;
      }
      if (fullStr === '1') {
        full = true;
      } else {
        full = false;
      }
      color = colorStr;
    } catch {}
    return {
      thickness,
      radius,
      color,
      roundCap,
      full
    };
  };
  const getRectByStr = str => {
    let [ticknessStr, offsetStr, colorStr, roundCapStr] = str.split(' ');
    let thickness = 1,
      offset = 0,
      roundCap = false,
      color = '#000',
      full = true;
    try {
      let thicknessValue = +ticknessStr;
      if (isNaN(thicknessValue)) {
        thicknessValue = 1;
      }
      thickness = thicknessValue;
      let offsetValue = +offsetStr;
      if (isNaN(offsetValue)) {
        offsetValue = 0;
      }
      let defaultOffset = size / 2 - thickness / 2;
      offset = defaultOffset - offsetValue;
      if (offset > size - thickness / 2) {
        offset = size - thickness / 2;
      }
      if (offset < thickness / 2) {
        offset = thickness / 2;
      }
      if (roundCapStr === '1') {
        roundCap = true;
      } else {
        roundCap = false;
      }
      color = colorStr;
    } catch {}
    return {
      thickness,
      offset,
      color,
      roundCap
    };
  };
  function change1Unit(dir) {
    let value = valueRef.current;
    let newValue = [...value];
    let lastValue = JSON.stringify(newValue);
    newValue = moveAll(newValue, dir * step);
    while (!isValueValid(newValue) && JSON.stringify(newValue) !== lastValue) {
      lastValue = JSON.stringify(newValue);
      newValue = moveAll(newValue, dir * step);
    }
    changeValue(newValue);
  }
  function changeHandle(obj) {
    if (disabled === true) {
      return;
    }
    let newValue = getChangedValue(obj);
    changeValue(newValue);
  }
  function getIndexLimit(index) {
    let value = valueRef.current;
    let before, after;
    if (index === 0) {
      before = start;
    } else {
      before = value[index - 1];
    }
    if (index === value.length - 1) {
      after = end;
    } else {
      after = value[index + 1];
    }
    return {
      before,
      after
    };
  }
  function moveAll(newValue, offset, ifFailedReturnOriginalValue) {
    let res = newValue.map(o => o + offset);
    if (res[0] < start || res[res.length - 1] > end) {
      return ifFailedReturnOriginalValue ? valueRef.current : newValue;
    }
    return res;
  }
  function getChangedValue(obj) {
    let {
      dx,
      dy,
      deltaCenterAngle,
      centerAngle
    } = obj;
    let startValue = [...temp.start];
    let index = temp.index;
    //agar faghat yek point darim har koja mousedown shod farz kon rooye oon point mousedown karde im
    if (startValue.length === 1 && index === false) {
      index = 0;
    }
    let res;
    if (index === false) {
      let deltaValue;
      if (round) {
        let v = deltaCenterAngle * (end - start) / 360;
        v = Math.round(v / step) * step;
        deltaValue = v;
      } else {
        deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
      }
      let newValue = moveAll(startValue, deltaValue, true);
      res = !isValueValid(newValue) ? valueRef.current : newValue;
    } else {
      let {
        before,
        after
      } = getIndexLimit(index);
      let newUnitValue;
      if (round) {
        newUnitValue = Math.round(getValueByAngle(centerAngle) / step) * step;
      } else {
        let deltaValue = Math.round(getValueByXP(getXPByX(vertical ? dy : dx)) / step) * step;
        newUnitValue = startValue[index] + deltaValue;
      }
      if (newUnitValue > after) {
        newUnitValue = after;
      }
      if (newUnitValue < before) {
        newUnitValue = before;
      }
      if (isValueDisabled(newUnitValue)) {
        newUnitValue = valueRef.current[index];
      }
      startValue[index] = newUnitValue;
      res = startValue;
    }
    return res;
  }
  function getSide() {
    if (vertical) {
      return reverse ? 'bottom' : 'top';
    }
    return reverse ? 'right' : 'left';
  }
  function getOffset() {
    return vertical ? 'left' : 'top';
  }
  function isValueDisabled(value) {
    return !!disabledDic[`a${value}`];
  }
  function getRootClassName() {
    let cls = 'ai-range';
    if (round) {
      cls += ' ai-range-round';
    } else {
      cls += ` ai-range-${vertical ? 'vertical' : 'horizontal'}`;
    }
    if (className) {
      cls += ' ' + className;
    }
    if (reverse) {
      cls += ' ai-range-reverse';
    }
    return cls;
  }
  function getRootStyle() {
    let {
      style
    } = rootProps;
    let res;
    if (round) {
      res = {
        width: size,
        height: size
      };
    } else if (vertical) {
      res = {
        width: size
      };
    } else {
      res = {
        height: size
      };
    }
    return {
      ...res,
      ...style
    };
  }
  function getRootProps() {
    let {
      attrs = {}
    } = rootProps;
    let rootStyle = getRootStyle();
    return AddToAttrs(attrs, {
      className: getRootClassName(),
      style: rootStyle,
      attrs: {
        ref: temp.dom
      }
    });
  }
  function root_node() {
    return /*#__PURE__*/_jsxs("div", {
      ...getRootProps(),
      children: [/*#__PURE__*/_jsx(RangeGroove, {}), text !== undefined && /*#__PURE__*/_jsx("div", {
        className: "ai-range-text",
        children: typeof text === 'function' ? text() : text
      }, 'rangetext'), !round && /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(RangeRanges, {}), /*#__PURE__*/_jsx(RangeFills, {})]
      }, 'rangefill'), /*#__PURE__*/_jsx(RangeSvg, {}), labels.map((label, i) => /*#__PURE__*/_jsx(RangeLabel, {
        label: label
      }, i)), value.map((itemValue, i) => /*#__PURE__*/_jsx(RangeValueContainer, {
        index: i,
        itemValue: itemValue
      }, 'rangecontainervalue' + i))]
    });
  }
  function fixValueInEmpty(value) {
    round = round || 1;
    let fill = round;
    let empty = 1 - fill;
    let emptyValue = empty * (end - start) / fill;
    if (value > end + emptyValue / 2) {
      value = start - emptyValue + value - end;
    }
    return value;
  }
  function getValueByAngle(angle) {
    let fillAngle = 360 * (round || 1);
    let emptyAngle = 360 - fillAngle;
    if (reverse) {
      angle = 180 - angle;
    }
    angle -= rotate;
    angle -= emptyAngle / 2;
    angle -= 90;
    angle = fixAngle(angle);
    let res = angle * (end - start) / fillAngle;
    res = fixValueInEmpty(res);
    return res;
  }
  function getAngleByValue(value, ang) {
    let fillAngle = 360 * round;
    let emptyAngle = 360 - fillAngle;
    let res = value * fillAngle / (end - start);
    res += 90;
    res += emptyAngle / 2;
    res += rotate;
    res += ang || 0;
    return reverse ? res = 180 - res : res;
  }
  function fixAngle(angle) {
    angle = angle % 360;
    return angle < 0 ? angle = 360 + angle : angle;
  }
  function getXPByValue(value) {
    return 100 * (value - start) / (end - start);
  }
  function getValueByXP(xp) {
    return xp * (end - start) / 100;
  }
  function getXPByX(x) {
    return x * 100 / $(temp.dom.current)[vertical ? 'height' : 'width']();
  }
  function getContext() {
    let context = {
      getXPByValue,
      rootProps,
      fixAngle,
      getAngleByValue,
      dom: temp.dom,
      getCircleByStr,
      getRectByStr,
      isValueDisabled,
      value: valueRef.current,
      getSide,
      getOffset,
      getDefaultOffset,
      sbp
    };
    return context;
  }
  return /*#__PURE__*/_jsx(RangeContext.Provider, {
    value: getContext(),
    children: root_node()
  });
};
const RangeGroove = () => {
  let {
    rootProps
  } = useContext(RangeContext);
  const attrs = AddToAttrs(rootProps.grooveAttrs, {
    className: 'ai-range-groove'
  });
  if (rootProps.round) {
    return null;
  } else {
    return /*#__PURE__*/_jsx("div", {
      ...attrs
    });
  }
};
const RangeSvg = () => {
  let {
    rootProps,
    value
  } = useContext(RangeContext);
  let {
    round,
    ranges = [],
    circles = [],
    size = Def('range-size'),
    end = 360
  } = rootProps;
  if (!round || !(ranges || [0]).length && !circles.length) {
    return null;
  }
  let pathes = [/*#__PURE__*/_jsx(RangeCircles, {}), /*#__PURE__*/_jsx(RangeRanges, {})];
  return /*#__PURE__*/_jsx("svg", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0
    },
    width: size,
    height: size,
    children: pathes
  });
};
const RangeCircles = () => {
  let {
    rootProps,
    getCircleByStr
  } = useContext(RangeContext);
  let {
    start = 0,
    end = 360,
    circles = [],
    size = Def('range-size')
  } = rootProps;
  let pathes = [];
  for (let i = 0; i < circles.length; i++) {
    let from = start,
      to = end;
    let {
      thickness,
      color,
      radius,
      roundCap,
      full
    } = getCircleByStr(circles[i], 'radius');
    let p = {
      thickness,
      color,
      from,
      to,
      radius,
      full,
      roundCap
    };
    pathes.push( /*#__PURE__*/_jsx(RangeArc, {
      ...p
    }));
  }
  return /*#__PURE__*/_jsx(_Fragment, {
    children: pathes
  });
};
const RangeFills = () => {
  let {
    rootProps,
    value
  } = useContext(RangeContext);
  let {
    start = 0,
    fill,
    round
  } = rootProps;
  if (round || fill === false) {
    return null;
  }
  let limit = value.length === 1 ? [start, value[0]] : [...value];
  let res = [];
  for (let i = 1; i < limit.length; i++) {
    let {
      thickness,
      style,
      className: fillClassName,
      color
    } = (typeof fill === 'function' ? fill(i) : fill) || {};
    let from = limit[i - 1];
    let to = limit[i];
    let className = 'ai-range-fill';
    if (fillClassName) {
      className += ' ' + fillClassName;
    }
    let p = {
      thickness,
      color,
      from,
      to,
      className,
      style
    };
    res.push( /*#__PURE__*/_createElement(RangeRect, {
      ...p,
      key: 'fill' + i
    }));
  }
  return /*#__PURE__*/_jsx(_Fragment, {
    children: res
  });
};
const RangeRanges = () => {
  let {
    rootProps,
    getCircleByStr,
    getRectByStr
  } = useContext(RangeContext);
  let {
    start = 0,
    ranges = [],
    round
  } = rootProps;
  let res = [],
    from = start,
    list = ranges;
  for (let i = 0; i < list.length; i++) {
    let [value, config] = list[i];
    let to = value;
    let rangeItem;
    if (round) {
      let {
        thickness,
        color,
        radius,
        roundCap
      } = getCircleByStr(config, 'offset');
      let p = {
        thickness,
        color,
        from,
        to,
        radius,
        roundCap,
        full: false
      };
      rangeItem = /*#__PURE__*/_jsx(RangeArc, {
        ...p
      });
    } else {
      let {
        thickness,
        color,
        offset,
        roundCap
      } = getRectByStr(config);
      let p = {
        thickness,
        color,
        from,
        to,
        offset,
        roundCap,
        className: 'ai-range-range'
      };
      rangeItem = /*#__PURE__*/_createElement(RangeRect, {
        ...p,
        key: 'range' + i
      });
    }
    res.push(rangeItem);
    from = to;
  }
  return /*#__PURE__*/_jsx(_Fragment, {
    children: res
  });
};
const RangeValueContainer = props => {
  let {
    rootProps,
    isValueDisabled,
    fixAngle,
    getAngleByValue,
    getXPByValue,
    dom,
    getSide
  } = useContext(RangeContext);
  let {
    itemValue,
    index
  } = props;
  let {
    round
  } = rootProps;
  let angle = fixAngle(getAngleByValue(itemValue));
  function containerProps() {
    let style;
    if (!round) {
      style = {
        [getSide()]: getXPByValue(itemValue) + '%'
      };
    } else {
      style = {
        transform: `rotate(${angle}deg)`
      };
    }
    return {
      className: 'ai-range-value-container',
      draggable: false,
      style
    };
  }
  let PROPS = {
    value: itemValue,
    index,
    disabled: isValueDisabled(itemValue),
    angle,
    parentDom: dom
  };
  return /*#__PURE__*/_jsxs("div", {
    ...containerProps(),
    children: [/*#__PURE__*/_createElement(RangeHandle, {
      ...PROPS,
      key: "handle"
    }), " ", /*#__PURE__*/_createElement(RangePoint, {
      ...PROPS,
      key: "point"
    })]
  });
};
const RangeRect = ({
  thickness,
  color,
  from,
  to,
  className,
  style,
  offset,
  roundCap
}) => {
  let {
    getXPByValue,
    rootProps,
    getSide
  } = useContext(RangeContext);
  let {
      vertical
    } = rootProps,
    startSide = getXPByValue(from),
    endSide = getXPByValue(to);
  let bigSizeStyle = {
    [vertical ? 'height' : 'width']: endSide - startSide + '%'
  };
  let smallSizeStyle = {
    [vertical ? 'width' : 'height']: thickness
  };
  let mainSideStyle = {
    [getSide()]: startSide + '%'
  };
  let otherSideStyle = offset ? {
    [vertical ? 'left' : 'top']: offset
  } : {};
  let borderRadiusStyle = roundCap ? {
    borderRadius: '100%'
  } : {};
  let colorStyle = {
    background: color
  };
  let Style = {
    ...bigSizeStyle,
    ...smallSizeStyle,
    ...mainSideStyle,
    ...otherSideStyle,
    ...borderRadiusStyle,
    ...colorStyle,
    ...style
  };
  return /*#__PURE__*/_jsx("div", {
    className: className,
    style: Style
  });
};
const RangeArc = ({
  thickness,
  color,
  from,
  to,
  radius,
  full,
  roundCap
}) => {
  let {
    fixAngle,
    getAngleByValue,
    rootProps
  } = useContext(RangeContext);
  let {
    size = Def('range-size'),
    reverse
  } = rootProps;
  let a, b;
  let x = size / 2,
    y = size / 2;
  if (full) {
    a = 0;
    b = 360;
  } else {
    let startAngle = fixAngle(getAngleByValue(from) + 90);
    let endAngle = fixAngle(getAngleByValue(to) + 90);
    if (endAngle === 0) {
      endAngle = 360;
    }
    a = startAngle;
    b = endAngle;
    if (reverse) {
      b = startAngle;
      a = endAngle;
    }
  }
  return /*#__PURE__*/_jsx("path", {
    d: svgArc(x, y, radius, a, b),
    stroke: color,
    strokeWidth: thickness,
    fill: "transparent",
    strokeLinecap: roundCap ? 'round' : undefined
  }, `from${from}to${to}`);
};
const RangePoint = props => {
  let {
    rootProps,
    getOffset,
    sbp
  } = useContext(RangeContext);
  let [temp] = useState({
    dom: /*#__PURE__*/createRef()
  });
  let {
    value,
    disabled,
    angle,
    index,
    parentDom
  } = props;
  if (rootProps.point === false) {
    return null;
  }
  let {
    round,
    size = Def('range-size')
  } = rootProps;
  let point = (rootProps.point || (() => {}))(value, {
    disabled,
    angle,
    value,
    index
  }) || {};
  let {
    attrs = {},
    html = value,
    offset = 0
  } = point;
  let zIndexAttrs = getEventAttrs('onMouseDown', () => {
    let containers = $(parentDom.current).find('ai-range-value-container');
    containers.css({
      zIndex: 10
    });
    containers.eq(index).css({
      zIndex: 100
    });
  });
  let containerStyle,
    pointStyle = {
      ...attrs.style
    };
  if (round) {
    containerStyle = {
      left: size / 2 + offset,
      transform: `rotate(${-angle}deg)`
    };
  } else {
    containerStyle = {
      [getOffset()]: offset
    };
  }
  let containerProps = {
    ref: temp.dom,
    className: 'ai-range-point-container',
    style: containerStyle,
    draggable: false
  };
  let pointProps = AddToAttrs(attrs, {
    className: ['ai-range-point'],
    style: pointStyle,
    attrs: {
      draggable: false,
      'data-index': index,
      ...zIndexAttrs
    }
  });
  return /*#__PURE__*/_createElement("div", {
    ...containerProps,
    key: 'rangepoint' + index
  }, /*#__PURE__*/_jsx("div", {
    ...pointProps,
    children: html
  }));
};
const RangeHandle = props => {
  let {
    rootProps,
    sbp
  } = useContext(RangeContext);
  let {
    value,
    angle,
    disabled,
    index
  } = props;
  let {
    handle = () => {},
    round
  } = rootProps;
  if (handle === false || !round) {
    return null;
  }
  if (handle && typeof handle !== 'function') {
    alert(`aio-input error => in type round, handle props should be a function,
        handle type = (value:number,{disabled:boolean,angle:number})=>{attrs:any}`);
    return null;
  }
  let {
    sharp = false,
    thickness = 10,
    size: handleSize = 90,
    color = '#000',
    offset = 0
  } = handle(value, {
    angle,
    disabled,
    value
  }) || {};
  let width = sbp(handleSize, {
    half: true
  });
  let height = sbp(thickness, {
    half: true
  });
  function getStyle() {
    if (sharp) {
      return {
        [width < 0 ? 'borderRight' : 'borderLeft']: `${Math.abs(width)}px solid ${color}`,
        borderTop: `${height / 2}px solid transparent`,
        borderBottom: `${height / 2}px solid transparent`,
        left: offset
      };
    } else {
      return {
        width,
        height,
        left: offset,
        background: color
      };
    }
  }
  let PROPS = AddToAttrs({}, {
    className: 'aio-input-handle',
    style: getStyle(),
    attrs: {
      draggable: false
    }
  });
  return /*#__PURE__*/_createElement("div", {
    ...PROPS,
    key: 'rangehandle' + index
  });
};
const RangeLabel = props => {
  let {
    dom,
    rootProps
  } = useContext(RangeContext);
  let {
    label
  } = props;
  let {
    zIndex,
    dynamic,
    step,
    list = []
  } = label;
  let {
    round,
    start = 0,
    end = 360,
    reverse,
    vertical
  } = rootProps;
  let [def] = useState(getDef);
  function getDef() {
    return RENDER(true);
  }
  function getList() {
    let res = [];
    if (step) {
      let {
        start: lstart = start,
        end: lend = end
      } = label;
      for (let i = lstart; i <= lend; i += step) {
        res.push(i);
      }
    }
    for (let i = 0; i < list.length; i++) {
      if (res.indexOf(list[i]) === -1) {
        res.push(list[i]);
      }
    }
    return res;
  }
  function updateLabels() {
    if (round || !label.autoHide || vertical) {
      return;
    }
    let container = $(dom.current);
    let labels = container.find('.ai-range-label');
    if (!labels.length) {
      return;
    }
    let firstLabel = labels.eq(0);
    let firstLabelHProp = firstLabel.attr('data-rotated') === 'yes' ? 'height' : 'width';
    let end = firstLabel.offset().left + (!reverse ? firstLabel[firstLabelHProp]() : 0);
    for (let i = 1; i < labels.length; i++) {
      let label = labels.eq(i);
      let hProp = label.attr('data-rotated') === 'yes' ? 'height' : 'width';
      label.css({
        display: 'flex'
      });
      let left = label.offset().left;
      let width = label[hProp]();
      let right = left + width;
      if (!reverse) {
        if (left < end + 5) {
          label.css({
            display: 'none'
          });
        } else {
          end = left + width;
        }
      } else {
        if (right > end - 5) {
          label.css({
            display: 'none'
          });
        } else {
          end = left;
        }
      }
    }
  }
  useEffect(() => {
    $(window).on('resize', updateLabels);
  }, []);
  useEffect(() => {
    updateLabels();
  });
  function RENDER(init) {
    if (!init && !dynamic) {
      return def;
    }
    return /*#__PURE__*/_jsx("div", {
      className: "ai-range-labels",
      style: {
        zIndex
      },
      children: getList().map(itemValue => /*#__PURE__*/_jsx(RangeLabelItem, {
        label: label,
        itemValue: itemValue
      }, itemValue))
    });
  }
  return /*#__PURE__*/_jsx(_Fragment, {
    children: RENDER(false)
  });
};
const RangeLabelItem = props => {
  let {
    rootProps,
    isValueDisabled,
    fixAngle,
    getAngleByValue,
    getXPByValue,
    getSide
  } = useContext(RangeContext);
  let {
    label,
    itemValue
  } = props;
  let {
    round,
    vertical,
    size = Def('range-size')
  } = rootProps;
  let angle;
  if (round) {
    angle = fixAngle(getAngleByValue(itemValue));
  }
  let disabled = isValueDisabled(itemValue);
  function getContainerStyle(distance) {
    if (round) {
      return {
        transform: `rotate(${angle}deg)`
      };
    } else {
      return {
        [getSide()]: getXPByValue(itemValue) + '%',
        ...distance
      };
    }
  }
  function getTextStyle(item, distance) {
    let res = {};
    if (round) {
      res = {
        ...res,
        ...distance
      };
      if (item.fixAngle) {
        res = {
          ...res,
          transform: `rotate(${-angle}deg)`
        };
      }
    }
    return {
      width: 0,
      height: 0,
      ...res
    };
  }
  function getDetails() {
    let item = label.setting(itemValue, {
      disabled,
      angle
    });
    let {
      offset = 0,
      html = ''
    } = item;
    let distance = {
      [round || vertical ? 'left' : 'top']: size / 2 + offset
    };
    let containerStyle = getContainerStyle(distance);
    let containerProps = {
      className: `ai-range-label-container`,
      style: containerStyle,
      draggable: false
    };
    let textProps = AddToAttrs({}, {
      className: [`ai-range-label`],
      style: getTextStyle(item, distance),
      attrs: {
        draggable: false
      }
    });
    return {
      html,
      textProps,
      containerProps
    };
  }
  let {
    html,
    textProps,
    containerProps
  } = getDetails();
  return /*#__PURE__*/_jsx("div", {
    ...containerProps,
    children: /*#__PURE__*/_jsx("div", {
      ...textProps,
      children: html
    })
  });
};
export const SideMenu = props => {
  let {
    items = [],
    onChange,
    option = {},
    type = 'normal'
  } = props;
  let cls = 'aio-input-sidemenu';
  const toggleRef = useRef(id => {});
  function getBadge(item) {
    let {
      badge
    } = item;
    if (!badge) {
      badge = [];
    }
    if (!Array.isArray(badge)) {
      badge = [badge];
    }
    if (!badge.length) {
      return [];
    }
    let res = [];
    for (let i = 0; i < badge.length; i++) {
      let {
        text,
        color = 'red',
        circle
      } = badge[i];
      res.push( /*#__PURE__*/_jsx("div", {
        className: `${cls}-badge ${cls}-align ${cls}-badge-${color}${circle ? ' ' + cls + `-badge-circle` : ''}`,
        children: text
      }));
    }
    return res;
  }
  function getAfter(option, active) {
    let {
      items = []
    } = option;
    let badge = getBadge(option);
    return /*#__PURE__*/_jsxs("div", {
      className: `${cls}-after ${cls}-align`,
      children: [!!badge.length && badge, !!items.length && I(active ? 'mdiChevronDown' : 'mdiChevronRight', 0.7)]
    });
  }
  function getBefore(option) {
    let {
      icon = I('mdiCircleMedium', 0.6)
    } = option;
    if (!icon) {
      return null;
    }
    return /*#__PURE__*/_jsx("div", {
      className: `${cls}-before`,
      children: /*#__PURE__*/_jsx("div", {
        className: `${cls}-icon ${cls}-align`,
        children: icon
      })
    });
  }
  const defaultOption = {
    text: 'option.text',
    value: 'option.value',
    toggleIcon: () => false,
    after: ({
      option,
      active
    }) => getAfter(option, !!active),
    before: ({
      option
    }) => getBefore(option),
    onClick: ({
      option
    }) => {
      let {
        items = [],
        value
      } = option;
      if (!!items.length) {
        toggleRef.current(value);
      } else if (option.onClick) {
        option.onClick();
      } else if (onChange) {
        onChange(option);
      }
    },
    className: ({
      level
    }) => `${cls}-row-level-${level}`
  };
  let finalOptions = {
    ...defaultOption,
    ...option,
    className: obj => {
      let className = `${cls}-row-level-${obj.level}`;
      if (typeof option.className === 'function') {
        const res = option.className(obj);
        if (res) {
          className += ' ' + res;
        }
      }
      return className;
    }
  };
  const attrs = AddToAttrs(props.attrs, {
    className: [cls, `aio-input-sidemenu-${type}`, props.className]
  });
  return /*#__PURE__*/_jsx(AIOInput, {
    ...attrs,
    className: attrs.className,
    type: "tree",
    size: 48,
    toggleRef: toggleRef,
    value: [...items],
    getChilds: p => p.row.items || [],
    option: finalOptions,
    indent: 0
  });
};
export const AICard = ({
  text,
  subtext,
  onClick,
  before,
  after
}) => {
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-card",
    children: [before !== undefined && /*#__PURE__*/_jsx("div", {
      className: "aio-input-card-before",
      onClick: e => e.stopPropagation(),
      children: before
    }), /*#__PURE__*/_jsxs("div", {
      className: "aio-input-card-body",
      onClick: onClick,
      children: [/*#__PURE__*/_jsx("div", {
        className: "aio-input-card-text",
        children: text
      }), subtext !== undefined && /*#__PURE__*/_jsx("div", {
        className: "aio-input-card-subtext",
        children: subtext
      })]
    }), after !== undefined && /*#__PURE__*/_jsx("div", {
      className: "aio-input-card-after",
      onClick: e => e.stopPropagation(),
      children: after
    })]
  });
};
export const AIPanel = ({
  text,
  subtext,
  before,
  after,
  body
}) => {
  function header_layout() {
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-panel-header",
      children: [/*#__PURE__*/_jsx("div", {
        className: "aio-input-panel-before",
        children: !!before && before
      }), /*#__PURE__*/_jsxs("div", {
        className: "aio-input-panel-texts",
        children: [/*#__PURE__*/_jsx("div", {
          className: "aio-input-panel-text",
          children: text
        }), subtext !== undefined && /*#__PURE__*/_jsx("div", {
          className: "aio-input-panel-subtext",
          children: subtext
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "aio-input-panel-after",
        children: !!after && after
      })]
    });
  }
  function body_layout() {
    return /*#__PURE__*/_jsx("div", {
      className: "aio-input-panel-body",
      children: body
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-panel",
    children: [header_layout(), " ", body_layout()]
  });
};
export const AISwitch = ({
  colors = ['#555', 'orange'],
  size = [16, 2, 3, 48],
  value,
  onChange = () => {}
}) => {
  function getContainerStyle() {
    return {
      paddingRight: size[0] + size[1],
      paddingLeft: size[1],
      border: `${size[2]}px solid ${value ? colors[1] : colors[0]}`
    };
  }
  function getOuterStyle() {
    return {
      width: size[3] - size[0] - size[1],
      height: size[0] + 2 * size[1]
    };
  }
  function getInnerStyle() {
    return {
      width: size[0],
      height: size[0],
      top: `calc(50% - ${size[0] / 2}px)`,
      background: value ? colors[1] : colors[0]
    };
  }
  return /*#__PURE__*/_jsx("div", {
    className: `aio-input-switch${value ? ' active' : ''}`,
    style: getContainerStyle(),
    onClick: () => onChange(!value),
    children: /*#__PURE__*/_jsx("div", {
      className: "aio-input-switch-outer",
      style: getOuterStyle(),
      children: /*#__PURE__*/_jsx("div", {
        className: "aio-input-switch-inner",
        style: getInnerStyle()
      })
    })
  });
};
export const AIBottomMenu = ({
  options,
  value,
  onChange,
  dir = 'v'
}) => {
  function item_layout(item) {
    const active = item.value === value;
    return /*#__PURE__*/_jsxs("div", {
      className: `aio-input-bottom-menu-item aio-input-bottom-menu-item-${dir}${active ? ' active' : ''}`,
      onClick: () => onChange(item.value),
      children: [!!item.before && item.before, item.text, !!item.after && item.after]
    }, item.value);
  }
  return /*#__PURE__*/_jsx("div", {
    className: "aio-input-bottom-menu",
    children: options.map((o, i) => item_layout(o))
  });
};
export function AIOInput_defaultProps(p) {
  let storage = new Storage('aio-input-storage');
  for (let prop in p) {
    storage.save(prop, p[prop]);
  }
}
function getTypes(props) {
  function isDropdown() {
    if (['select', 'date', 'time'].indexOf(type) !== -1) {
      return true;
    }
    if (['text', 'number', 'textarea'].indexOf(type) !== -1 && props.options) {
      return true;
    }
    if (type === 'button' && props.popover) {
      return true;
    }
    return false;
  }
  let {
    type,
    multiple
  } = props;
  let isMultiple;
  if (type === 'table' || type === 'tags') {
    isMultiple = true;
  } else if (['radio', 'range', 'file', 'buttons', 'select', 'date', 'acardion'].indexOf(type) !== -1) {
    isMultiple = !!multiple;
  } else {
    isMultiple = false;
  }
  ;
  return {
    isMultiple,
    isInput: ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1,
    isDropdown: isDropdown(),
    hasOption: ['text', 'number', 'textarea', 'color', 'select', 'radio', 'tabs', 'list', 'buttons', 'tags'].indexOf(type) !== -1,
    hasPlaceholder: ['text', 'number', 'textarea', 'color', 'select', 'table', 'image', 'date'].indexOf(type) !== -1,
    hasKeyboard: ['text', 'textarea', 'number', 'password'].indexOf(type) !== -1,
    hasText: ['checkbox', 'button', 'select'].indexOf(type) !== -1,
    hasSearch: ['table', 'select'].indexOf(type) !== -1
  };
}
function getDefaultProps(props, types) {
  let valueType = Array.isArray(props.value) ? 'array' : typeof props.value;
  props = {
    ...props
  };
  if (props.type === 'select') {
    if (!!props.multiple) {
      if (!props.text) {
        props.text = 'Select Items';
      }
    }
  } else if (props.type === 'time') {
    if (!props.value) {
      props.value = {};
    }
  } else if (props.type === 'acardion') {
    props.deSelect = true;
  } else if (props.type === 'date') {
    if (props.multiple) {
      props.option = {
        ...props.option,
        text: 'option',
        value: 'option'
      };
    }
  }
  if (props.loading === true) {
    props.disabled = true;
  }
  if (types.isMultiple) {
    if (!props.value) {
      props.value = [];
    } else if (valueType !== 'array') {
      props.value = [props.value];
    }
  } else {
    if (props.type === 'tree') {} else if (valueType === 'array') {
      props.value = props.value[0];
    }
  }
  return props;
}
function Def(prop) {
  let res = {
    'theme': [],
    'date-size': 180,
    'tree-size': 36,
    'range-size': 72,
    'date-unit': 'day'
  }[prop];
  return res;
}
function I(path, size, p) {
  return new GetSvg().getIcon(path, size, p);
}
//isOpen ro baraye tashkhise active(open) boodane node haye tree mifrestim
function GetOptions(p) {
  let {
    options,
    rootProps,
    types,
    level,
    isOpen,
    change,
    defaultOptionProps = {}
  } = p;
  let {
    deSelect
  } = rootProps;
  let result = [];
  let dic = {};
  let draggable = types.isDropdown && types.hasOption && !!rootProps.onSwap;
  function getDefaultOptionChecked(v) {
    if (rootProps.type === 'select' && types.isMultiple) {
      return rootProps.value.indexOf(v) !== -1;
    }
    if (rootProps.type === 'radio') {
      return types.isMultiple ? rootProps.value.indexOf(v) !== -1 : rootProps.value === v;
    }
  }
  if (deSelect && typeof deSelect !== 'function' && deSelect !== true) {
    options = [deSelect, ...options];
  }
  function isActive(optionValue) {
    if (rootProps.type === 'tree') {
      return !!isOpen && !!isOpen(optionValue);
    } else if (types.isMultiple) {
      return rootProps.value.indexOf(optionValue) !== -1;
    } else {
      return optionValue === rootProps.value;
    }
  }
  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionDetails = {
      option,
      index: i,
      active: false,
      level,
      rootProps,
      change: change ? newRow => {
        change(option, newRow);
      } : undefined
    };
    let disabled = !!rootProps.disabled || !!rootProps.loading || !!GetOptionProps({
      rootProps,
      optionDetails,
      defaultOptionProps,
      key: 'disabled'
    });
    //ghabl az har chiz sharte namayesh ro check kon
    let show = GetOptionProps({
      rootProps,
      optionDetails,
      defaultOptionProps,
      key: 'show'
    });
    if (show === false) {
      continue;
    }
    let optionValue = GetOptionProps({
      rootProps,
      optionDetails,
      defaultOptionProps,
      key: 'value'
    });
    let active = isActive(optionValue);
    let text = GetOptionProps({
      rootProps,
      optionDetails,
      defaultOptionProps,
      key: 'text'
    });
    //hala ke value ro dari active ro rooye details set kon ta baraye gereftane ettelaat active boodan moshakhas bashe
    optionDetails.active = active;
    let attrs = GetOptionProps({
      rootProps,
      optionDetails,
      defaultOptionProps,
      key: 'attrs',
      def: {}
    });
    let defaultChecked = getDefaultOptionChecked(optionValue);
    let checked = GetOptionProps({
      rootProps,
      optionDetails,
      defaultOptionProps,
      key: 'checked',
      def: defaultChecked
    });
    //object:option => do not remove mutability to use original value of option in for example tree row
    let obj = {
      show,
      loading: rootProps.loading,
      attrs,
      text,
      value: optionValue,
      disabled,
      draggable,
      checkIcon: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'checkIcon'
      }) || rootProps.checkIcon,
      checked,
      toggleIcon: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        def: true,
        key: 'toggleIcon'
      }),
      before: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'before'
      }),
      after: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'after'
      }),
      justify: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'justify'
      }),
      subtext: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'subtext'
      }),
      onClick: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'onClick',
        preventFunction: true
      }),
      className: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'className'
      }),
      style: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'style'
      }),
      tagAttrs: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'tagAttrs'
      }),
      tagBefore: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'tagBefore'
      }),
      close: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'close',
        def: !types.isMultiple
      }),
      tagAfter: GetOptionProps({
        rootProps,
        optionDetails,
        defaultOptionProps,
        key: 'tagAfter'
      }),
      details: optionDetails
    };
    result.push(obj);
    dic['a' + obj.value] = obj;
  }
  return {
    optionsList: result,
    optionsDic: dic
  };
}
function GetOptionProps(p) {
  let {
    rootProps,
    key,
    def,
    preventFunction,
    optionDetails,
    defaultOptionProps = {}
  } = p;
  const {
    option
  } = optionDetails;
  let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key](optionDetails) : option[key];
  if (optionResult !== undefined) {
    return optionResult;
  }
  let prop = (rootProps.option || {})[key];
  prop = prop === undefined ? defaultOptionProps[key] : prop;
  if (typeof prop === 'string') {
    try {
      let value;
      eval('value = ' + prop);
      return value;
    } catch {}
  }
  if (typeof prop === 'function' && !preventFunction) {
    let res = prop(optionDetails);
    return res === undefined ? def : res;
  }
  return prop !== undefined ? prop : def;
}
function getTimeByUnit(rootProps, justToday) {
  let {
    value = {},
    jalali,
    unit = {
      year: true,
      month: true,
      day: true
    }
  } = rootProps;
  function getToday() {
    let today = new AIODate().getToday(jalali);
    return {
      year: today[0],
      month: today[1],
      day: today[2],
      hour: today[3],
      minute: today[4],
      second: today[5]
    };
  }
  let today = getToday();
  let newValue = {};
  let u;
  for (u in unit) {
    if (unit[u] === true) {
      let v = value[u];
      let min = {
        year: 1000,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0
      }[u];
      let max = {
        year: 3000,
        month: 12,
        day: 31,
        hour: 23,
        minute: 59,
        second: 59
      }[u];
      if (v !== undefined && typeof v !== 'number' || v < min || v > max) {
        alert(`aio input error => in type time value.${u} should be an number between ${min} and ${max}`);
      }
      let res = v === undefined || justToday ? today[u] : v;
      newValue[u] = res;
    }
  }
  return newValue;
}
function getTimeText(rootProps) {
  let value = getTimeByUnit(rootProps);
  if (!value) {
    if (typeof rootProps.placeholder === 'string') {
      return rootProps.placeholder;
    }
    if (typeof rootProps.text === 'string') {
      return rootProps.text;
    }
    return '';
  }
  if (rootProps.pattern) {
    return new AIODate().getDateByPattern(value, rootProps.pattern);
  }
  if (rootProps.text !== undefined) {
    return rootProps.text;
  }
  let text = [],
    dateArray = [];
  if (value.year !== undefined) {
    dateArray.push(Get2Digit(value.year));
  }
  if (value.month !== undefined) {
    dateArray.push(Get2Digit(value.month));
  }
  if (value.day !== undefined) {
    dateArray.push(Get2Digit(value.day));
  }
  if (dateArray.length) {
    text.push(dateArray.join('/'));
  }
  let timeArray = [];
  if (value.hour !== undefined) {
    timeArray.push(Get2Digit(value.hour));
  }
  if (value.minute !== undefined) {
    timeArray.push(Get2Digit(value.minute));
  }
  if (value.second !== undefined) {
    timeArray.push(Get2Digit(value.second));
  }
  if (timeArray.length) {
    text.push(timeArray.join(':'));
  }
  return text.join(' ');
}

//onSearch on tree
//rowOption on table
//now on date namayesh ya adame namayeshe panele emrooz va dokmeye emrooz

export const AIText = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "text"
});
export const AINumber = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "number"
});
export const AITextarea = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "textarea"
});
export const AIPassword = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "password"
});
export const AIColor = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "color"
});
export const AISelect = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "select"
});
export const AIRadio = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "radio"
});
export const AITabs = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "tabs"
});
export const AIButtons = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "buttons"
});
export const AITags = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "tags"
});
export const AITree = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "tree"
});
export const AIImage = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "image"
});
export const AIFile = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "file"
});
export const AICheckbox = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "checkbox"
});
export const AIDate = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "date"
});
export const AITime = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "time"
});
export const AISlider = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "slider"
});
export const AISpinner = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "spinner"
});
export const AIAcardion = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "acardion"
});
export const AIList = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "list"
});
export const AITable = props => /*#__PURE__*/_jsx(AIOInput, {
  ...props,
  type: "table"
});
export const MonthCalendar = ({
  date,
  onClick = () => {},
  dateAttrs = () => ({})
}) => {
  const DATE = new AIODate();
  const [jalali] = useState(DATE.isJalali(date));
  const [monthStrings] = useState(DATE.getMonths(jalali));
  const [firstDayIndex] = useState(DATE.getWeekDay([date[0], date[1], 1]).index);
  const [monthDaysLength] = useState(DATE.getMonthDaysLength(date));
  function weekDays_layout() {
    return DATE.getWeekDays(true).map(o => /*#__PURE__*/_jsx("div", {
      className: "month-calendar-weekday",
      children: o[0]
    }));
  }
  function spaces_layout() {
    return new Array(firstDayIndex).fill(0).map(() => /*#__PURE__*/_jsx("div", {
      className: ""
    }));
  }
  function cells_layout() {
    return new Array(monthDaysLength).fill(0).map((o, i) => cell_layout([date[0], date[1], i + 1]));
  }
  function cell_layout(dateArray) {
    const attrs = AddToAttrs(dateAttrs(dateArray), {
      className: `month-calendar-day`,
      attrs: {
        onClick: () => onClick(dateArray)
      }
    });
    return /*#__PURE__*/_jsx("div", {
      ...attrs,
      children: dateArray[2]
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "month-calendar",
    children: [/*#__PURE__*/_jsx("div", {
      className: "month-calendar-title",
      children: monthStrings[date[1] - 1]
    }), /*#__PURE__*/_jsx("div", {
      className: "month-calendar-weekdays",
      children: weekDays_layout()
    }), /*#__PURE__*/_jsxs("div", {
      className: "month-calendar-days",
      children: [spaces_layout(), " ", cells_layout()]
    })]
  });
};
const PrismCode = ({
  code,
  language = 'js',
  style = {}
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return /*#__PURE__*/_jsx("div", {
    className: "aio-doc-code",
    style: style,
    children: /*#__PURE__*/_jsx("pre", {
      style: {
        height: '100%',
        overflow: 'auto'
      },
      children: /*#__PURE__*/_jsx("code", {
        className: `language-${language}`,
        children: code
      })
    })
  });
};
export function Code(code, language, style) {
  return /*#__PURE__*/_jsx(PrismCode, {
    code: code,
    language: language,
    style: style
  });
}
const Section = ({
  text,
  subtext,
  before,
  after,
  body
}) => {
  function header_layout() {
    return /*#__PURE__*/_jsxs("div", {
      className: "aio-input-section-header",
      children: [/*#__PURE__*/_jsx("div", {
        className: "aio-input-section-before",
        children: !!before && before
      }), /*#__PURE__*/_jsxs("div", {
        className: "aio-input-section-texts",
        children: [/*#__PURE__*/_jsx("div", {
          className: "aio-input-section-text",
          children: text
        }), subtext !== undefined && /*#__PURE__*/_jsx("div", {
          className: "aio-input-section-subtext",
          children: subtext
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "aio-input-section-after",
        children: !!after && after
      })]
    });
  }
  function body_layout() {
    return /*#__PURE__*/_jsx("div", {
      className: "aio-input-section-body",
      children: body
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "aio-input-section",
    children: [header_layout(), " ", body_layout()]
  });
};