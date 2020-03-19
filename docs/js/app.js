var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Legacy from './Legacy.js';
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    const options = { center: true, width: 400, height: 400 };
    const url = new URL("./child.html", location.href);
    const now = new Date();
    url.searchParams.append("_dummy_", now.valueOf().toString());
    const value = yield Legacy.showModalDialog(url.href, null, options);
    if (value) {
        alert(value);
    }
});
//# sourceMappingURL=app.js.map