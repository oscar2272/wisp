declare module "rehype-add-classes" {
  import { Plugin } from "unified";

  const rehypeAddClasses: Plugin<[Record<string, string>]>;
  export default rehypeAddClasses;
}
