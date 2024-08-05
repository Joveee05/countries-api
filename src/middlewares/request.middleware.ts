import { Request, Response, Application } from 'express';
import expressUseragent from 'express-useragent';

const middleware = (req: Request, _: Response, next: any) => {
  const userAgent = req.useragent;

  const logInfo = {
    Method: req.method,
    URL: req.originalUrl,
    Browser: userAgent?.browser,
    OS: userAgent?.os,
    IP: req.ip,
    Platform: userAgent?.platform,
    IsMobile: userAgent?.isMobile,
    IsTablet: userAgent?.isTablet,
    IsDesktop: userAgent?.isDesktop,
    Body: req.body ? JSON.stringify(req.body) : null,
  };

  console.log('Request Info:', JSON.stringify(logInfo, null, 2));
  next();
};

export default function (app: Application) {
  app.use(expressUseragent.express());
  app.use(middleware);
}
