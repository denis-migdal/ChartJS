import buildConfigs from "./build/WebpackFramework/index.js";

export default buildConfigs("./src/",
                            "./dist/${version}/",
                            {
                                "@misc"  : "libs/misc/src/",
                            });