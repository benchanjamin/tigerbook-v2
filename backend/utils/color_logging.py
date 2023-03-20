import logging

FMT = "[{levelname:^10}] {message}"
FORMATS = {
    logging.DEBUG: FMT,
    logging.INFO: f"\33[36m{FMT}\33[0m",
    logging.WARNING: f"\33[33m{FMT}\33[0m",
    logging.ERROR: f"\33[16m{FMT}\33[0m",
    logging.CRITICAL: f"\33[1m{FMT}\33[0m",
}


class CustomFormatter(logging.Formatter):
    def format(self, record) -> str:
        log_fmts = FORMATS[record.levelno]
        formatter = logging.Formatter(log_fmts, style="{")
        return formatter.format(record)


handler = logging.StreamHandler()
handler.setFormatter(CustomFormatter())
logging.basicConfig(
    level=logging.DEBUG,
    handlers=[handler]
)
log = logging.getLogger()
