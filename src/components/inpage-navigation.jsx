import { useState, useRef, useEffect } from "react";

// 声明两个全局变量，分别用于获取“当前激活标签”的 DOM 引用 (activeTabRef) 和“激活标签下划线”的 DOM 引用 (activeTabLineRef)
export let activeTabLineRef;
export let activeTabRef;

/**
 * InPageNavigation 组件
 *
 * @param {Array} routes            导航标签的路由/名称列表
 * @param {Array} defaultHidden     要在特定屏幕尺寸时隐藏的标签（通过 className 控制）
 * @param {number} defaultActiveIndex 默认激活的标签索引
 * @param {JSX.Element|JSX.Element[]} children 根据当前激活标签索引来渲染的内容
 */
const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {

    // 用于下划线移动、标签激活元素的引用（DOM 操作）
    activeTabLineRef = useRef();
    activeTabRef = useRef();

    // inPageNavIndex 用来存储当前激活标签的索引
    let [ inPageNavIndex, setInPageNavIndex ] = useState(null);

    // 用于判断是否已经注册了 window 的 resize 事件，以及存储当前窗口宽度
    let [ isResizeEventAdded, setIsResizeEventAdded ] = useState(false);
    let [ width, setWidth ] = useState(window.innerWidth);

    /**
     * changePageState
     * 点击标签时触发，计算下划线（activeTabLineRef）应该移动到的位置和宽度，并更新当前激活索引
     *
     * @param {HTMLElement} btn - 当前被点击的按钮 DOM
     * @param {number} i       - 当前按钮的索引
     */
    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn; 
        // 根据被点击按钮的宽度和左偏移，设置下划线的宽度和左位置
        activeTabLineRef.current.style.width = offsetWidth + "px"; 
        activeTabLineRef.current.style.left = offsetLeft + "px"; 

        // 更新当前选中的标签索引
        setInPageNavIndex(i);
    }

    /**
     * 在组件加载和窗口大小变化时触发的副作用
     * - 当屏幕宽度大于 766px 且当前索引不等于默认激活索引时，重置下划线到默认激活的标签位置
     * - 只在初始化时添加一次 resize 事件监听
     */
    useEffect(() => {
        // 如果当前宽度大于 766，并且 inPageNavIndex 和 defaultActiveIndex 不一致，就重置下划线
        if(width > 766 && inPageNavIndex != defaultActiveIndex){
            changePageState(activeTabRef.current, defaultActiveIndex);
        }

        // 如果还没有注册过 resize 事件，则注册一次
        if(!isResizeEventAdded){
            window.addEventListener('resize', () => {
                if(!isResizeEventAdded){
                    setIsResizeEventAdded(true);
                }
                // 更新当前窗口宽度
                setWidth(window.innerWidth);
            });
        }
    }, [width]);

    return (
        <>
            {/* 
              导航条容器：
              - relative: 为了让下划线可以通过 absolute 定位
              - overflow-x-auto: 保证标签内容过多时可以横向滚动 
            */}
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                
                {routes.map((route, i) => {
                    return (
                        <button 
                            // 如果是默认激活标签，将 ref 赋值给 activeTabRef
                            ref={ i == defaultActiveIndex ? activeTabRef : null }
                            key={i} 
                            // 动态生成 className：
                            //  - 当前选中的标签文字颜色变黑
                            //  - 其他标签为暗灰色
                            //  - 如果 defaultHidden 中包含该 route，则通过 md:hidden 实现特定屏幕下隐藏
                            className={
                                "p-4 px-5 capitalize " +
                                ( inPageNavIndex == i ? "text-black " : "text-dark-grey " ) +
                                ( defaultHidden.includes(route) ? " md:hidden " : " " )
                            }
                            // 点击时更新下划线位置并更新选中索引
                            onClick={(e) => { changePageState(e.target, i) }}
                        >
                            { route }
                        </button>
                    );
                })}

                {/* 下划线，初始位置在底部，通过 ref 和 style 更新其位置和宽度 */}
                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300 border-dark-grey" />
            </div>

            {/* 根据当前索引渲染子组件，如果 children 是数组，则渲染对应索引；否则直接渲染 */}
            { Array.isArray(children) ? children[inPageNavIndex] : children }
        </>
    );
};

export default InPageNavigation;
