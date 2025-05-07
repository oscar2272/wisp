"""
Tests for Django management command: wait_for_db
"""
from unittest.mock import patch
from psycopg2 import OperationalError as Psycopg2OpError
from django.db.utils import OperationalError
from django.core.management import call_command


@patch("core.management.commands.wait_for_db.Command.check")
def test_wait_for_db_ready(mock_check):
    """Test: DB is available on first check"""
    mock_check.return_value = True

    call_command("wait_for_db")

    mock_check.assert_called_once_with(databases=["default"])


@patch("time.sleep")
@patch("core.management.commands.wait_for_db.Command.check")
def test_wait_for_db_delay(mock_check, mock_sleep):
    """Test: DB unavailable initially, becomes available after retries"""
    mock_check.side_effect = (
        [Psycopg2OpError] * 4 + [OperationalError] * 3 + [True]
    )

    call_command("wait_for_db")

    assert mock_check.call_count == 8
    mock_check.assert_called_with(databases=["default"])
