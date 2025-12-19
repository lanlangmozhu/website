
import GsapBox from './GsapBox';
import TrafficLight from './TrafficLight';

// 注册所有你想在 Markdown 中使用的组件
export const DemoRegistry: Record<string, React.FC<any>> = {
  'GsapBox': GsapBox,
  'TrafficLight': TrafficLight,
};
